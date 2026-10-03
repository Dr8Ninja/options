import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.identity.ts",
  workers: 1,
  fullyParallel: false,
  retries: 0,
  forbidOnly: Boolean(process.env.CI),
  timeout: 60000,
  reporter: [
    ["list"],
    ["json", { outputFile: "test-results/p13-results.json" }],
  ],
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "https://localhost:18445",
    ignoreHTTPSErrors: true,
    trace: "retain-on-failure",
  },
});
