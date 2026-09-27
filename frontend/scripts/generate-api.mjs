import openapiTS, { astToString } from "openapi-typescript";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const source = new URL(
  "../../docs/engineering/openapi/openapi.json",
  import.meta.url,
);
const target = new URL("../src/api/schema.d.ts", import.meta.url);
const hash = createHash("sha256")
  .update(await readFile(source))
  .digest("hex");
const output =
  `// Generated from OpenAPI ${JSON.parse(await readFile(source, "utf8")).info.version}; SHA-256 ${hash}\n` +
  astToString(await openapiTS(source));
if (process.argv.includes("--check")) {
  if ((await readFile(target, "utf8")) !== output)
    throw new Error("API types drift; run npm run generate:api");
} else await writeFile(target, output);
