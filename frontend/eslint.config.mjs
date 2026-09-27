import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import ts from "typescript-eslint";
import hooks from "eslint-plugin-react-hooks";
import next from "@next/eslint-plugin-next";
import globals from "globals";
export default defineConfig([
  js.configs.recommended,
  ...ts.configs.recommended,
  { languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { "react-hooks": hooks, "@next/next": next },
    rules: {
      ...hooks.configs.recommended.rules,
      ...next.configs.recommended.rules,
      ...next.configs["core-web-vitals"].rules,
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "**/data/v1/**",
                "**/research/**",
                "**/design/prototype/**",
              ],
              message:
                "Use reviewed API DTOs; never bundle editorial or prototype content.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "next-env.d.ts",
    "src/api/schema.d.ts",
    "playwright-report/**",
    "test-results*/**",
  ]),
]);
