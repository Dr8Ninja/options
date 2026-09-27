import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  outputDir: "test-results-webauthn",
  testMatch: "**/*.webauthn.ts",
  workers: 1,
  retries: 0,
  forbidOnly: Boolean(process.env.CI),
  reporter: [["list"]],
  use: {
    baseURL: "https://localhost:18443",
    ignoreHTTPSErrors: true,
    browserName: "chromium",
  },
});
