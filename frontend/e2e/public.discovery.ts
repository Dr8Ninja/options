import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile, readFile, rm } from "node:fs/promises";
import path from "node:path";
const evidence = path.resolve("../.local/p11-runtime/discovery-screenshots");
test.beforeAll(async () => {
  await mkdir(evidence, { recursive: true });
});
test("search → filtered resource → exact published topic, with honest source review", async ({
  page,
}) => {
  await page.goto("/search?q=RX01");
  await page.getByText(/Refine results/).click();
  await page
    .getByLabel("Content type", { exact: true })
    .selectOption(["RESOURCE"]);
  await page.getByLabel("Cost", { exact: true }).selectOption(["free"]);
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page).toHaveURL(/kind=RESOURCE/);
  await expect(page.getByRole("status")).toContainText("1 published results");
  await page
    .getByRole("link", { name: "Exercising Options", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Exercising Options",
  );
  await expect(
    page.getByRole("heading", { name: "Verification scope and date" }),
  ).toBeVisible();
  await expect(
    page.getByText("A source link is not proof", { exact: false }),
  ).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({
    path: path.join(evidence, "resource-desktop.png"),
    fullPage: true,
  });
  await page
    .getByRole("link", { name: "Read topic M22.01", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByText("This is an outline of intended coverage.", {
      exact: false,
    }),
  ).toBeVisible();
});
test("combined library filters preserve URL, reload and back navigation", async ({
  page,
}) => {
  await page.goto("/resources");
  await page.getByText(/Refine results/).click();
  await page.getByLabel("Cost", { exact: true }).selectOption(["free"]);
  await page
    .getByLabel("Difficulty", { exact: true })
    .selectOption(["Beginner"]);
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page).toHaveURL(/cost=free/);
  const url = page.url();
  const titles = await page.locator(".discovery-results h2").allTextContents();
  expect(titles.length).toBeGreaterThan(0);
  await page.reload();
  await expect(page.locator(".discovery-results h2")).toHaveText(titles);
  await page.locator(".discovery-results h2 a").first().click();
  await expect(
    page.getByRole("heading", { name: "Access and rights" }),
  ).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(url);
  await expect(page.locator(".discovery-results h2")).toHaveText(titles);
  await page.getByText(/Refine results/).click();
  expect(await page.getByLabel("Cost", { exact: true }).inputValue()).toBe(
    "free",
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({
    path: path.join(evidence, "library-filters-desktop.png"),
    fullPage: true,
  });
  await page
    .getByRole("link", { name: "Remove Cost: free", exact: true })
    .click();
  await expect(page).not.toHaveURL(/cost=free/);
  await expect(page).toHaveURL(/difficulty=Beginner/);
});
test("pagination, empty results, invalid input and unpublished exclusion", async ({
  page,
  request,
}) => {
  await page.goto("/resources?sort=title");
  const first = await page.locator(".discovery-results h2").allTextContents();
  await page.getByRole("link", { name: "Next page" }).click();
  await expect(page).toHaveURL(/page=1/);
  await expect(page).toHaveURL(/generation=/);
  const second = await page.locator(".discovery-results h2").allTextContents();
  expect(second.some((x) => first.includes(x))).toBe(false);
  await page.reload();
  await expect(page.locator(".discovery-results h2")).toHaveText(second);
  await page.getByRole("link", { name: "Previous page" }).click();
  await expect(page.locator(".discovery-results h2")).toHaveText(first);
  await page.goto("/resources?q=zzzzp12nomatch");
  await expect(
    page.getByRole("heading", { name: "No matching published content" }),
  ).toBeVisible();
  await page.goto("/resources?sort=unsafe");
  await expect(
    page.getByRole("heading", { name: "Review your search" }),
  ).toBeVisible();
  await page.goto("/resources?difficulty=never-exists");
  await expect(
    page.getByRole("heading", { name: "Review your search" }),
  ).toBeVisible();
  await page.goto("/resources?page=1&generation=0");
  await expect(
    page.getByText("The publication changed.", { exact: false }),
  ).toBeVisible();
  await page.goto("/search?q=P12DRAFTSECRET");
  await expect(page.getByRole("status")).toContainText("0 published results");
  expect((await request.get("/topics/P12-HIDDEN")).status()).toBe(404);
  const facets = await request.get("/api/v1/discovery-facets?entity=search");
  expect(facets.status()).toBe(200);
  expect(await facets.text()).not.toContain("P12PRIVATEFACET");
  const project = await request.get("/api/v1/projects/PR01");
  const body = await project.json();
  expect(body.assessmentCriteria.join(" ")).toContain("%");
  expect(JSON.stringify(body)).not.toContain("reference_behavior");
});
test("path → shared module and project prerequisites are actionable", async ({
  page,
}) => {
  await page.goto("/paths");
  await page
    .getByRole("link", { name: "Absolute Beginner", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Entry criteria and preparation" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Exit capabilities" }),
  ).toBeVisible();
  await expect(
    page.getByText("Public next-lesson links", { exact: false }),
  ).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  // Path gates are authored blueprints, not publicly runnable quizzes.
  await expect(page.locator('a[href="/quizzes/QZ-M01"]')).toHaveCount(0);
  await expect(page.getByText("QZ-M01", { exact: true }).first()).toBeVisible();
  await page.screenshot({
    path: path.join(evidence, "path-desktop.png"),
    fullPage: true,
  });
  await page.locator('a[href="/modules/M01"]').first().click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Financial arithmetic",
  );
  await page.goto("/projects");
  await page
    .getByRole("link", { name: "Cash-flow and payoff engine", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Lawful data plan" }),
  ).toBeVisible();
  await expect(
    page.getByText("hypothetical/synthetic data", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Assessment criteria" }),
  ).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({
    path: path.join(evidence, "project-desktop.png"),
    fullPage: true,
  });
  await page.locator('#preparation a[href="/modules/M01"]').click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Financial arithmetic",
  );
});
test("mobile filters, keyboard and server rendered discovery", async ({
  page,
  browser,
  request,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/resources?cost=unknown");
  await page.getByText(/Refine results/).click();
  await page.getByLabel("Search titles, IDs or text").focus();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Search", exact: true }),
  ).toBeFocused();
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
    path: path.join(evidence, "library-mobile-dark.png"),
    fullPage: true,
  });
  const context = await browser.newContext({
    javaScriptEnabled: false,
    ignoreHTTPSErrors: true,
  });
  const nojs = await context.newPage();
  await nojs.goto("https://localhost:18444/resources?q=RX01");
  await expect(
    nojs.getByRole("link", { name: "Exercising Options", exact: true }),
  ).toBeVisible();
  await context.close();
  const html = await request.get("/resources?q=RX01");
  expect(await html.text()).toContain("Exercising Options");
  expect(html.headers()["cache-control"]).toContain("no-store");
  expect(html.headers()["x-robots-tag"]).toContain("noindex");
});
test("real API outage keeps discovery unavailable and noindex", async ({
  page,
}) => {
  const control = process.env.P11_CONTROL_FILE!;
  await rm(control + ".ack", { force: true });
  await writeFile(control, "stop-api");
  await expect
    .poll(() => readFile(control + ".ack", "utf8").catch(() => ""), {
      timeout: 15000,
    })
    .toBe("stop-api");
  await page.goto("/resources");
  await expect(
    page.getByRole("heading", {
      name: "Learning content is temporarily unavailable",
    }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    "content",
    /noindex/,
  );
});
