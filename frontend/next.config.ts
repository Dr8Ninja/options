import type { NextConfig } from "next";
import { readConfig } from "./src/config/environment";
readConfig(process.env);
const config: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  htmlLimitedBots: /.*/, // Resolve public metadata before streaming for consistent crawler and browser status.
  // Browser APIs use Caddy. No competing Next business backend or broad CORS.
};
export default config;
