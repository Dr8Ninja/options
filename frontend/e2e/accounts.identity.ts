import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile, writeFile, rm, mkdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
const runtime = process.env.P13_RUNTIME!;
const password = "A meadow of 9 patient fireflies";
let first = "";
const captures: unknown[] = [];
test.beforeEach(async ({ page }) => {
  page.on("response", async (response) => {
    const url = new URL(response.url());
    if (
      !url.pathname.startsWith("/api/v1/") ||
      url.pathname.endsWith("/auth/csrf") ||
      response.status() === 204
    )
      return;
    if (!(url.pathname.includes("/auth/") || url.pathname.includes("/me")))
      return;
    try {
      captures.push({
        method: response.request().method().toLowerCase(),
        path: url.pathname.slice(7),
        status: response.status(),
        body: await response.json(),
        cacheControl: response.headers()["cache-control"],
      });
    } catch {
      /* Aborted response is not evidence. */
    }
  });
});
test.afterAll(async () => {
  await writeFile(
    path.join(runtime, "responses.json"),
    JSON.stringify(captures, null, 2),
  );
});
async function message(
  request: import("@playwright/test").APIRequestContext,
  email: string,
  old = "",
  action?: string,
) {
  const { mailOrigin } = JSON.parse(
    await readFile(path.join(runtime, "ready.json"), "utf8"),
  );
  let link = "";
  await expect
    .poll(
      async () => {
        const r = await request.get(
          `${mailOrigin}/api/v1/search?query=${encodeURIComponent("to:" + email)}`,
        );
        const rows = (await r.json()).messages ?? [];
        for (const row of rows) {
          const m = await (
            await request.get(`${mailOrigin}/api/v1/message/${row.ID}`)
          ).json();
          const found = m.Text?.match(
            /https:\/\/localhost:18445\/account\/[a-z-]+#token=[A-Za-z0-9_-]{43}/,
          )?.[0];
          if (
            found &&
            found !== old &&
            (!action || found.includes(`/account/${action}#`))
          ) {
            link = found;
            return true;
          }
        }
        return false;
      },
      { timeout: 20000 },
    )
    .toBe(true);
  return link;
}
async function register(page: import("@playwright/test").Page, email: string) {
  await page.goto("/account/register");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Create an account", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("eligible");
}
async function login(
  page: import("@playwright/test").Page,
  email: string,
  pw = password,
) {
  await page.goto("/account/sign-in");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(pw);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
}
async function command(value: string) {
  await rm(path.join(runtime, "ack"), { force: true });
  await writeFile(path.join(runtime, "control"), value);
  await expect
    .poll(() => readFile(path.join(runtime, "ack"), "utf8").catch(() => ""))
    .toBe(value);
}
async function post(
  request: import("@playwright/test").APIRequestContext,
  url: string,
  data?: unknown,
) {
  const csrf = await (await request.get("/api/v1/auth/csrf")).json();
  return request.post(url, {
    data,
    headers: { Origin: "https://localhost:18445", "X-CSRF-TOKEN": csrf.token },
  });
}
test("real registration, verification, login, private deep link and two-user isolation", async ({
  page,
  browser,
  request,
}) => {
  first = `first-${Date.now()}@example.invalid`;
  await register(page, first);
  const link = await message(request, first);
  await page.goto(link);
  await expect(
    page.getByRole("button", { name: "Verify your email", exact: true }),
  ).toBeEnabled();
  await page
    .getByRole("button", { name: "Verify your email", exact: true })
    .click();
  await expect(page.getByRole("status").first()).toContainText("complete");
  await login(page, first, "incorrect password value");
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "could not be verified",
  );
  await login(page, first);
  await expect(
    page.getByRole("heading", { name: "Your account", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByText(first, { exact: true })).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  const other = await browser.newContext({ ignoreHTTPSErrors: true });
  const b = await other.newPage();
  await b.goto("https://localhost:18445/account");
  await expect(b).toHaveURL(/sign-in/);
  const second = `second-${Date.now()}@example.invalid`;
  await register(b, second);
  const next = await message(request, second);
  await b.goto(next);
  await b
    .getByRole("button", { name: "Verify your email", exact: true })
    .click();
  await expect(b.getByRole("status").first()).toContainText("complete");
  await login(b, second);
  await expect(b.getByText(second, { exact: true })).toBeVisible();
  expect(await b.content()).not.toContain(first);
  expect(await page.content()).not.toContain(second);
  const privateHtml = await page.request.get("/account");
  expect(await privateHtml.text()).toContain(first);
  expect(privateHtml.headers()["cache-control"]).toContain("no-store");
  expect(privateHtml.headers()["x-robots-tag"]).toContain("noindex");
  const csrfDenied = await page.request.post("/api/v1/auth/logout", {
    headers: { Origin: "https://localhost:18445" },
  });
  expect(csrfDenied.status()).toBe(403);
  expect((await page.request.get("/api/v1/admin/content")).status()).toBe(403);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await mkdir(path.join(runtime, "screenshots"), { recursive: true });
  await page.screenshot({
    path: path.join(runtime, "screenshots/account-mobile.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page).toHaveURL(/sign-in/);
  await b.reload();
  await expect(b.getByText(second, { exact: true })).toBeVisible();
  await other.close();
});
test("expired and reused recovery tokens, expired sessions, and safe redirect", async ({
  page,
  request,
}) => {
  const email = `recovery-${Date.now()}@example.invalid`;
  await register(page, email);
  const verify = await message(request, email);
  await page.goto(verify);
  await page
    .getByRole("button", { name: "Verify your email", exact: true })
    .click();
  await expect(page.getByRole("status").first()).toContainText("complete");
  expect(
    (
      await post(request, "/api/v1/auth/password-reset-requests", { email })
    ).status(),
  ).toBe(202);
  const expired = await message(request, email, verify);
  await command("expire-recovery");
  await page.goto(expired);
  await page.getByLabel("New password", { exact: true }).fill(password);
  await page
    .getByRole("button", { name: "Choose a new password", exact: true })
    .click();
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "no longer valid",
  );
  expect(
    (
      await post(request, "/api/v1/auth/password-reset-requests", { email })
    ).status(),
  ).toBe(202);
  let latest = "";
  await expect
    .poll(async () => {
      latest = await message(request, email, expired);
      return latest !== verify && latest !== expired;
    })
    .toBe(true);
  const token = new URL(latest).hash.split("=")[1];
  expect(
    (
      await post(request, "/api/v1/auth/password-reset-confirmations", {
        token,
        newPassword: password,
      })
    ).status(),
  ).toBe(200);
  expect(
    (
      await post(request, "/api/v1/auth/password-reset-confirmations", {
        token,
        newPassword: password,
      })
    ).status(),
  ).toBe(400);
  await page.goto("/account/sign-in?next=https://evil.invalid");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL("https://localhost:18445/account");
  await command("expire-sessions");
  await page.reload();
  await expect(page).toHaveURL(/sign-in/);
});
test("PostgreSQL security keys and offline administrator activation require both factors", async ({
  page,
  request,
}) => {
  const email = `operator-${Date.now()}@example.invalid`;
  await register(page, email);
  await page.goto(await message(request, email));
  await page
    .getByRole("button", { name: "Verify your email", exact: true })
    .click();
  await expect(page.getByRole("status").first()).toContainText("complete");
  await login(page, email);
  await expect(
    page.getByRole("heading", { name: "Your account", exact: true }),
  ).toBeVisible();
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("WebAuthn.enable");
  for (let n = 1; n <= 2; n++) {
    const { authenticatorId } = await cdp.send(
      "WebAuthn.addVirtualAuthenticator",
      {
        options: {
          protocol: "ctap2",
          transport: "usb",
          hasResidentKey: true,
          hasUserVerification: true,
          isUserVerified: true,
          automaticPresenceSimulation: true,
        },
      },
    );
    await page.getByLabel("Security key label").fill(`Independent key ${n}`);
    await page
      .getByRole("button", { name: "Register security key", exact: true })
      .click();
    await expect(page.getByRole("status").last()).toHaveText(
      "Security key registered.",
    );
    if (n === 1)
      await cdp.send("WebAuthn.removeVirtualAuthenticator", {
        authenticatorId,
      });
  }
  const me = await (await page.request.get("/api/v1/me")).json();
  const { operatorDsn } = JSON.parse(
    await readFile(path.join(runtime, "ready.json"), "utf8"),
  );
  for (const action of ["invite", "activate"]) {
    const r = spawnSync(
      process.env.IDENTITY_OPERATOR_PYTHON!,
      [
        "../scripts/identity-operator.py",
        action,
        "--account",
        me.accountId,
        "--operator-record",
        "disposable-test-operator",
        "--independent-keys-confirmed",
      ],
      {
        env: { ...process.env, IDENTITY_OPERATOR_DSN: operatorDsn },
        encoding: "utf8",
      },
    );
    expect(r.status, r.stderr).toBe(0);
  }
  await login(page, email);
  await expect(page).toHaveURL(/security-key/);
  const pending = await (await page.request.get("/api/v1/auth/session")).json();
  expect(pending.state).toBe("MFA_REQUIRED");
  expect(pending.roles).toContain("ADMIN");
  expect(
    (
      await post(page.request, "/api/v1/me/password", { newPassword: password })
    ).status(),
  ).toBe(403);
  let assertion: unknown;
  page.on("request", (r) => {
    if (r.url().endsWith("/api/v1/auth/webauthn/assertions"))
      assertion = r.postDataJSON();
  });
  await page
    .getByRole("button", { name: "Verify security key", exact: true })
    .click();
  await expect(page.getByRole("status").last()).toHaveText(
    "Security key verified.",
  );
  const session = await (await page.request.get("/api/v1/auth/session")).json();
  expect(session.state).toBe("ACTIVE");
  expect(session.webauthnAuthenticatedAt).toBeTruthy();
  expect(
    (
      await post(page.request, "/api/v1/auth/webauthn/assertions", assertion)
    ).status(),
  ).toBe(400);
  const keys = await (
    await page.request.get("/api/v1/me/webauthn/credentials")
  ).json();
  const csrf = await (await page.request.get("/api/v1/auth/csrf")).json();
  expect(
    (
      await page.request.delete(
        `/api/v1/me/webauthn/credentials/${keys.items[0].credentialId}`,
        {
          headers: {
            Origin: "https://localhost:18445",
            "X-CSRF-TOKEN": csrf.token,
          },
        },
      )
    ).status(),
  ).toBe(409);
  // A signed assertion with altered origin must fail even with a fresh challenge.
  await page.route(
    "**/api/v1/auth/webauthn/assertions",
    async (route) => {
      const input = route.request().postDataJSON();
      const data = JSON.parse(
        Buffer.from(input.response.clientDataJSON, "base64url").toString(),
      );
      data.origin = "https://evil.invalid";
      input.response.clientDataJSON = Buffer.from(
        JSON.stringify(data),
      ).toString("base64url");
      await route.continue({ postData: JSON.stringify(input) });
    },
    { times: 1 },
  );
  await page
    .getByRole("button", { name: "Verify security key", exact: true })
    .click();
  await expect(page.getByRole("status").last()).toContainText(
    "could not be verified",
  );
  await page.route(
    "**/api/v1/auth/webauthn/assertions",
    async (route) => {
      await command("expire-challenges");
      await route.continue();
    },
    { times: 1 },
  );
  await page
    .getByRole("button", { name: "Verify security key", exact: true })
    .click();
  await expect(page.getByRole("status").last()).toContainText(
    "no longer valid",
  );
  // Another verified user has its own fresh challenge but cannot use this account's key.
  expect(
    (
      await post(request, "/api/v1/auth/login", { email: first, password })
    ).status(),
  ).toBe(200);
  expect(
    (await post(request, "/api/v1/auth/webauthn/assertion-options")).status(),
  ).toBe(200);
  expect(
    (
      await post(request, "/api/v1/auth/webauthn/assertions", assertion)
    ).status(),
  ).toBe(400);
  expect(
    (
      await post(request, "/api/v1/auth/password-reset-requests", { email })
    ).status(),
  ).toBe(202);
  const reset = await message(request, email, "", "reset");
  const resetToken = new URL(reset).hash.split("=")[1];
  expect(
    (
      await post(request, "/api/v1/auth/password-reset-confirmations", {
        token: resetToken,
        newPassword: password,
      })
    ).status(),
  ).toBe(200);
  await login(page, email);
  await expect(page).toHaveURL("https://localhost:18445/account");
  expect(
    (await (await page.request.get("/api/v1/auth/session")).json()).roles,
  ).toEqual(["LEARNER"]);
  await cdp.detach();
});
