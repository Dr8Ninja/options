import "server-only";
import type { Metadata } from "next";
import { readConfig } from "@/config/environment";
import { indexable, summary, type Card } from "./links";
export function metadata(
  title: string,
  description: string,
  path: string,
  allowed: boolean,
): Metadata {
  const origin = readConfig(process.env).PUBLIC_ORIGIN;
  return {
    title: `${title} · Options`,
    description: summary(description),
    alternates: { canonical: origin + path },
    robots: { index: allowed, follow: allowed },
    openGraph: {
      title,
      description: summary(description),
      url: origin + path,
      siteName: "Options",
      type: "website",
      locale: "en_US",
    },
  };
}
export const cardMetadata = (card: Card) =>
  metadata(card.title, card.summary, card.canonicalPath, indexable(card));

export async function renderStamp() {
  return (
    (await (await import("next/headers")).headers()).get("x-render-token") ??
    "server-render"
  );
}
