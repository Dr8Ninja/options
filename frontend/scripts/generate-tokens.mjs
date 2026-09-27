import { readFile, writeFile } from "node:fs/promises";
const tokens = JSON.parse(
  await readFile(new URL("../../design/tokens.json", import.meta.url), "utf8"),
);
let css = "/* Generated from design/tokens.json. */\n";
for (const [name, colors] of Object.entries(tokens.themes)) {
  css += `${name === "light" ? ":root, " : ""}[data-theme="${name}"] {\n`;
  css +=
    Object.entries(colors)
      .map(([key, value]) => `  --${key}: ${value};`)
      .join("\n") + "\n}\n";
}
css += ":root {\n";
for (const [key, value] of Object.entries(tokens.typography)) {
  if (typeof value === "string") css += `  --font-${key}: ${value};\n`;
}
for (const [key, value] of Object.entries(tokens.typography.sizesRem))
  css += `  --text-${key}: ${value}rem;\n`;
for (const [key, value] of Object.entries(tokens.typography.lineHeights))
  css += `  --leading-${key}: ${value};\n`;
for (const value of tokens.spacingPx)
  css += `  --space-${value}: ${value}px;\n`;
for (const [key, value] of Object.entries(tokens.layout))
  if (!Array.isArray(value))
    css += `  --${key}: ${value}${key.endsWith("Ch") ? "ch" : "px"};\n`;
for (const [key, value] of Object.entries(tokens.radiusPx))
  css += `  --radius-${key}: ${value}px;\n`;
css += `  --target: ${tokens.targets.minPx}px;\n  --focus-width: ${tokens.focus.widthPx}px;\n  --focus-offset: ${tokens.focus.offsetPx}px;\n}\n`;
const target = new URL("../src/styles/tokens.css", import.meta.url);
if (process.argv.includes("--check")) {
  if ((await readFile(target, "utf8")) !== css)
    throw new Error("Design tokens drift");
} else await writeFile(target, css);
