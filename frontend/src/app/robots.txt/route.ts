import { readConfig } from "@/config/environment";
export const dynamic = "force-dynamic";
export function GET() {
  const { PUBLIC_ORIGIN, APP_ENVIRONMENT } = readConfig(process.env);
  const rules =
    APP_ENVIRONMENT === "PRODUCTION"
      ? [
          "Allow: /",
          ...[
            "/api/",
            "/me",
            "/account",
            "/admin",
            "/editor",
            "/preview",
            "/search",
            "/*?",
          ].map((p) => `Disallow: ${p}`),
          `Sitemap: ${PUBLIC_ORIGIN}/sitemap.xml`,
        ]
      : ["Disallow: /"];
  return new Response(["User-agent: *", ...rules, ""].join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
