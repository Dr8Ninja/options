import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { writeFile, readFile, rm, mkdir } from "node:fs/promises";
import path from "node:path";
const evidence = path.resolve("../.local/p11-runtime/reading-screenshots");
async function command(value: string) {
  const file = process.env.P11_CONTROL_FILE!;
  await rm(file + ".ack", { force: true });
  await writeFile(file, value);
  await expect
    .poll(async () => readFile(file + ".ack", "utf8").catch(() => ""), {
      timeout: 15000,
    })
    .toBe(value);
}

test("home → curriculum → phase → module → topic uses imported content and keyboard navigation", async ({
  page,
}) => {
  await mkdir(evidence, { recursive: true });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Understand the contract",
  );
  await page.screenshot({
    path: path.join(evidence, "home-desktop.png"),
    fullPage: true,
  });
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.getByRole("link", { name: "Explore the curriculum" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Curriculum roadmap",
  );
  await page.screenshot({
    path: path.join(evidence, "curriculum-desktop.png"),
    fullPage: true,
  });
  const phase = page.locator(".roadmap a").first();
  await phase.click();
  await expect(
    page.getByRole("heading", { name: "Modules in this phase" }),
  ).toBeVisible();
  await page
    .getByRole("link", {
      name: "Financial arithmetic and economic purpose",
      exact: true,
    })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Financial arithmetic",
  );
  await expect(
    page.getByRole("heading", { name: "Learning objectives" }),
  ).toBeVisible();
  await page.locator('a[href="/topics/M01.01"]').first().click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Units and signs",
  );
  await expect(
    page.getByText("This is an outline of intended coverage.", {
      exact: false,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /bookmark|complete|progress/i }),
  ).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({
    path: path.join(evidence, "topic-outline-desktop.png"),
    fullPage: true,
  });
});
test("deep link renders authored math, tables, code and metadata without running content", async ({
  page,
  request,
}) => {
  const response = await request.get("/topics/M01.02", { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe("/topics/units-renderer-example");
  const html = await request.get("/topics/units-renderer-example");
  expect(html.status()).toBe(200);
  expect(html.headers()["cache-control"]).toContain("no-store");
  const source = await html.text();
  expect(source).toContain("Renderer verification specimen");
  expect(source).toContain("<math");
  expect(source).toContain("<table");
  await page.goto("/topics/units-renderer-example");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://localhost:18444/topics/units-renderer-example",
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://localhost:18444/topics/units-renderer-example",
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "index, follow",
  );
  await expect(
    page.getByRole("navigation", { name: "Breadcrumb" }),
  ).toContainText("Financial arithmetic");
  expect(
    await page.evaluate(() => Reflect.get(window, "P11_UNSAFE")),
  ).toBeUndefined();
  expect(
    await page.locator('a[href^="javascript:"],iframe,.authored img').count(),
  ).toBe(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({
    path: path.join(evidence, "lesson-desktop.png"),
    fullPage: true,
  });
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).toContain("/topics/units-renderer-example");
  expect(xml).not.toContain("/topics/M01.01");
  expect(xml).not.toContain("/me/");
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
  const missing = await request.get("/topics/NOT-PUBLISHED");
  expect(missing.status()).toBe(404);
  const privatePage = await request.get("/editor/preview/private");
  expect(privatePage.headers()["x-robots-tag"]).toContain("noindex");
});
test("small screens, dark appearance and no-JavaScript reading retain usable content", async ({
  page,
  browser,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByText("Menu", { exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByText("Menu", { exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await page.getByRole("link", { name: "Curriculum", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Curriculum roadmap",
  );
  await page.goto("/topics/units-renderer-example");
  await expect(
    page.getByRole("heading", { name: "Renderer verification specimen" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Dark appearance" }).click();
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({
    path: path.join(evidence, "lesson-mobile-dark.png"),
    fullPage: true,
  });
  const context = await browser.newContext({
    javaScriptEnabled: false,
    ignoreHTTPSErrors: true,
  });
  const nojs = await context.newPage();
  await nojs.goto("https://localhost:18444/topics/units-renderer-example");
  await expect(
    nojs.getByRole("heading", { name: "Renderer verification specimen" }),
  ).toBeVisible();
  await expect(nojs.locator("table")).toBeVisible();
  await context.close();
});
test("withdrawal removes visible content and the sitemap", async ({
  page,
  request,
}) => {
  await page.goto("/topics/units-renderer-example");
  await expect(
    page.getByRole("heading", { name: "Renderer verification specimen" }),
  ).toBeVisible();
  await command("withdraw");
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(
    page.getByRole("heading", { name: "This material is no longer available" }),
  ).toBeVisible({ timeout: 15000 });
  await expect(
    page.getByRole("heading", { name: "Renderer verification specimen" }),
  ).toHaveCount(0);
  const updatedSitemap = await request.get("/sitemap.xml");
  expect(updatedSitemap.status()).toBe(200);
  expect(await updatedSitemap.text()).not.toContain(
    "/topics/units-renderer-example",
  );
});
test("a real API outage produces an honest noindex error and a retry action", async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await command("stop-api");
  await page.goto("/curriculum");
  await expect(
    page.getByRole("heading", {
      name: "Learning content is temporarily unavailable",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Reload this page" }),
  ).toBeVisible();
  expect(
    await page.locator('meta[name="robots"]').first().getAttribute("content"),
  ).toContain("noindex");
  await page.screenshot({
    path: path.join(evidence, "api-unavailable-mobile.png"),
    fullPage: true,
  });
  expect((await request.get("/sitemap.xml")).status()).toBe(503);
});
