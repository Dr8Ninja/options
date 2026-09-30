import "server-only";
import { cache } from "react";
import { readConfig } from "@/config/environment";
import { ApiError, errorFromResponse } from "@/api/errors";
import type { Card, ReadingKind, Schema } from "./links";
export const get = cache(async <T>(path: string): Promise<T> => {
  if (
    !/^\/(programs|phases|modules|topics|subtopics|resources|paths|projects|capstones|exercises|quizzes|discovery-facets|search|routes|content-version)(\?|\/|$)/.test(
      path,
    ) ||
    path.includes("..") ||
    path.includes("\\")
  )
    throw new ApiError(400);
  const { API_INTERNAL_ORIGIN } = readConfig(process.env);
  let response: Response;
  try {
    response = await fetch(`${API_INTERNAL_ORIGIN}/api/v1${path}`, {
      cache: "no-store",
      credentials: "omit",
      redirect: "error",
      signal: AbortSignal.timeout(8000),
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new ApiError(503);
  }
  if (!response.ok) throw errorFromResponse(response);
  return response.json() as Promise<T>;
});
export const version = () => get<Schema["ContentVersion"]>("/content-version");
export const program = (id: string) =>
  get<Schema["Program"]>(`/programs/${encodeURIComponent(id)}`);
export const phase = (id: string) =>
  get<Schema["Phase"]>(`/phases/${encodeURIComponent(id)}`);
export const moduleDetail = (id: string) =>
  get<Schema["Module"]>(`/modules/${encodeURIComponent(id)}`);
export const topic = (id: string) =>
  get<Schema["Topic"]>(`/topics/${encodeURIComponent(id)}`);
export const subtopic = (id: string) =>
  get<Schema["Subtopic"]>(`/subtopics/${encodeURIComponent(id)}`);
export const resource = (id: string) =>
  get<Schema["Resource"]>(`/resources/${encodeURIComponent(id)}`);
export const detail = (kind: ReadingKind, id: string) =>
  ({
    programs: program,
    phases: phase,
    modules: moduleDetail,
    topics: topic,
    subtopics: subtopic,
  })[kind](id);
export const resolve = (path: string) =>
  get<Schema["RouteResolution"]>(`/routes?path=${encodeURIComponent(path)}`);
export async function consistent<T>(
  work: (generation: string) => Promise<T>,
): Promise<T> {
  const before = await version();
  const result = await work(before.generation);
  await ensureGeneration(before.generation);
  return result;
}
export async function allCards(
  kind: string,
  generation: string,
): Promise<Card[]> {
  const items: Card[] = [];
  for (let page = 0; page < 100; page++) {
    const result = await get<Schema["SearchPage"]>(
      `/search?kind=${kind}&limit=50&page=${page}&generation=${generation}&sort=title`,
    );
    if (result.contentVersion.generation !== generation)
      throw new ApiError(503);
    items.push(...result.items);
    if (!result.hasMore) return items;
  }
  throw new ApiError(503);
}
export const overview = cache(async () =>
  consistent(async (generation) => {
    const [programs, phases, modules, total, lessons] = await Promise.all([
      allCards("PROGRAM", generation),
      allCards("PHASE", generation),
      allCards("MODULE", generation),
      get<Schema["SearchPage"]>(
        `/search?kind=TOPIC&limit=1&generation=${generation}`,
      ),
      get<Schema["SearchPage"]>(
        `/search?kind=TOPIC&visibility=LESSON&limit=1&generation=${generation}`,
      ),
    ]);
    return {
      programs,
      phases,
      modules,
      total: total.total,
      lessons: lessons.total,
      generation,
    };
  }),
);

export async function ensureGeneration(generation: string) {
  // Deliberately bypass request memoization for the final publication check.
  const { API_INTERNAL_ORIGIN } = readConfig(process.env);
  const response = await fetch(
    `${API_INTERNAL_ORIGIN}/api/v1/content-version`,
    {
      cache: "no-store",
      redirect: "error",
      credentials: "omit",
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!response.ok || (await response.json()).generation !== generation)
    throw new ApiError(503);
}
