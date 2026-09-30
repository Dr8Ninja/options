import "server-only";
import { cache } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { get, resolve, consistent } from "@/learning/catalog";
import { ApiError } from "@/api/errors";
import { readingPath, type Schema } from "@/learning/links";
export const discoveryKinds = [
  "resources",
  "paths",
  "projects",
  "capstones",
  "exercises",
  "quizzes",
] as const;
export type DiscoveryKind = (typeof discoveryKinds)[number];
export type DiscoveryDetail =
  | Schema["Resource"]
  | Schema["Path"]
  | Schema["Project"]
  | Schema["Capstone"]
  | Schema["Exercise"]
  | Schema["Quiz"];
export const loadDiscovery = cache(async (kind: string, slug: string) => {
  if (
    !discoveryKinds.includes(kind as DiscoveryKind) ||
    !readingPath(`/${kind}/${slug}`)
  )
    notFound();
  try {
    const route = await resolve(`/${kind}/${slug}`);
    if (route.status === "RETIRED") return { error: new ApiError(409) };
    if (!readingPath(route.canonicalPath)) return { error: new ApiError(503) };
    if (route.status === "RENAMED") permanentRedirect(route.canonicalPath);
    const data = await consistent(async (generation) => {
      const item = await get<DiscoveryDetail>(
        `/${kind}/${encodeURIComponent(route.id)}`,
      );
      if (item.contentVersion.generation !== generation)
        throw new ApiError(503);
      return item;
    });
    return { data };
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    if (error.status === 404) notFound();
    return { error };
  }
});
