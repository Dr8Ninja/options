import { expect, test } from "@playwright/test";
test("password, JDBC challenge session and verified WebAuthn assertion compose safely", async ({
  page,
  context,
}) => {
  test.setTimeout(60000);
  const cdp = await context.newCDPSession(page);
  await cdp.send("WebAuthn.enable");
  const { authenticatorId } = await cdp.send(
    "WebAuthn.addVirtualAuthenticator",
    {
      options: {
        protocol: "ctap2",
        transport: "internal",
        hasResidentKey: true,
        hasUserVerification: true,
        isUserVerified: true,
        automaticPresenceSimulation: true,
      },
    },
  );
  await page.goto("/fixture");
  const api = context.request;
  async function csrf() {
    const response = await api.get("/api/v1/auth/csrf");
    expect(response.status()).toBe(200);
    return (await response.json()).token as string;
  }
  async function post(path: string, data: unknown) {
    return api.post(path, {
      headers: {
        Origin: "https://localhost:18443",
        "X-CSRF-TOKEN": await csrf(),
      },
      data,
      maxRedirects: 0,
    });
  }
  const before = await api.get("/api/v1/auth/csrf");
  const cookieBefore = (await context.cookies()).find(
    (c) => c.name === "__Host-OTRSESSION",
  )?.value;
  const password = process.env.FIXTURE_PASSWORD;
  if (!password) throw new Error("Missing ephemeral test credential");
  const login = await api.post("/login", {
    headers: {
      Origin: "https://localhost:18443",
      "X-CSRF-TOKEN": (await before.json()).token,
    },
    form: { username: "fixture", password },
    maxRedirects: 0,
  });
  expect(login.status()).toBe(204);
  expect(
    (await context.cookies()).find((c) => c.name === "__Host-OTRSESSION")
      ?.value,
  ).not.toBe(cookieBefore);
  expect((await api.get("/fixture/privileged")).status()).toBe(403);
  const creation = await post("/webauthn/register/options", {});
  expect(creation.status()).toBe(200);
  const creationOptions = await creation.json();
  expect(creationOptions.authenticatorSelection.userVerification).toBe(
    "required",
  );
  const credential = await page.evaluate(async (options) => {
    const key = (await navigator.credentials.create({
      publicKey: PublicKeyCredential.parseCreationOptionsFromJSON(options),
    })) as PublicKeyCredential;
    return key.toJSON();
  }, creationOptions);
  const registration = await post("/webauthn/register", {
    publicKey: { credential, label: "Virtual test key" },
  });
  expect(registration.status()).toBe(200);
  async function assertion(verified: boolean) {
    const response = await post("/webauthn/authenticate/options", {});
    expect(response.status()).toBe(200);
    const options = await response.json();
    expect(options.userVerification).toBe("required");
    await cdp.send("WebAuthn.setResponseOverrideBits", {
      authenticatorId,
      isBadUV: !verified,
    });
    // Negative case: a valid signature without UV, despite server-required UV in its JDBC session.
    if (!verified) options.userVerification = "preferred";
    return page.evaluate(async (value) => {
      const key = (await navigator.credentials.get({
        publicKey: PublicKeyCredential.parseRequestOptionsFromJSON(value),
      })) as PublicKeyCredential;
      return key.toJSON();
    }, options);
  }
  const invalid = await assertion(false);
  const rejected = await post("/login/webauthn", invalid);
  expect(rejected.status()).toBeGreaterThanOrEqual(300);
  expect((await api.get("/fixture/privileged")).status()).toBe(403);
  const valid = await assertion(true);
  const accepted = await post("/login/webauthn", valid);
  expect(accepted.status()).toBeLessThan(400);
  expect((await api.get("/fixture/privileged")).status()).toBe(200);
  const replay = await post("/login/webauthn", valid);
  expect(replay.status()).toBeGreaterThanOrEqual(400);
});
