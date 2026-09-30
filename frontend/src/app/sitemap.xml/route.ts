import { allCards, consistent } from "@/learning/catalog";
import { indexable, readingPath } from "@/learning/links";
import { readConfig } from "@/config/environment";
export const dynamic = "force-dynamic";
const xml = (s: string) =>
  s.replace(
    /[<>&'"]/g,
    (x) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[x]!,
  );
export async function GET() {
  try {
    const paths = await consistent(async (generation) => {
      const cards = await allCards(
        "PROGRAM&kind=PHASE&kind=MODULE&kind=TOPIC&kind=SUBTOPIC&kind=RESOURCE&kind=PATH&kind=PROJECT&kind=CAPSTONE",
        generation,
      );
      const paths = cards
        .filter(indexable)
        .map((c) => readingPath(c.canonicalPath))
        .filter((p): p is string => p !== null);
      if (cards.some((c) => c.kind === "PROGRAM" && indexable(c)))
        paths.push("/", "/curriculum");
      return [...new Set(paths)].sort();
    });
    const origin = readConfig(process.env).PUBLIC_ORIGIN;
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${xml(origin + p)}</loc></url>`).join("")}</urlset>`,
      {
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    return new Response("Sitemap temporarily unavailable.", {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "Retry-After": "30",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }
}
