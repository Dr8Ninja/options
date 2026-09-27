import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("real HTTPS shell, both themes, keyboard and no horizontal overflow", async ({
  page,
}) => {
  const response = await page.goto("/");
  expect(response?.headers()["cache-control"]).toContain("no-store");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Understand the contract",
  );
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  for (const theme of ["light", "dark"]) {
    if (theme === "dark")
      await page.getByRole("button", { name: "Dark appearance" }).click();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.screenshot({
      path: `test-results/shell-${test.info().project.name}-${theme}.png`,
      fullPage: true,
    });
  }
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
test("same-origin security and JDBC pre-session survive real HTTP requests", async ({
  request,
}) => {
  const health = await request.get("/api/health");
  expect(await health.json()).toEqual({ status: "UP" });
  expect(health.headers()["set-cookie"]).toBeUndefined();
  const csrf = await request.get("/api/v1/auth/csrf");
  expect(csrf.status()).toBe(200);
  const token = await csrf.json();
  expect(token.headerName).toBe("X-CSRF-TOKEN");
  expect(csrf.headers()["set-cookie"]).toContain("__Host-OTRSESSION=");
  expect(csrf.headers()["set-cookie"]).toContain("Secure");
  expect(csrf.headers()["set-cookie"]).toContain("HttpOnly");
  const denied = await request.get("/api/v1/me");
  expect(denied.status()).toBe(401);
  const hostile = await request.post("/api/v1/auth/logout", {
    headers: { Origin: "https://hostile.invalid", "X-CSRF-TOKEN": token.token },
  });
  expect(hostile.status()).toBe(403);
  expect((await request.get("/actuator/health/readiness")).status()).toBe(404);
  expect((await request.get("/v3/api-docs")).status()).toBe(404);
});
