import "server-only";
import { get, consistent } from "@/learning/catalog";
import { ApiError } from "@/api/errors";
import type { Schema } from "@/learning/links";
import { parseQuery, paramsFor, type Surface } from "./query";
export async function discover(
  surface: Surface,
  raw: Record<string, string | string[] | undefined>,
) {
  const query = parseQuery(raw, surface);
  return consistent(async (generation) => {
    if (query.generation && query.generation !== generation)
      throw new ApiError(409);
    const base = { ...query, q: "", values: {}, page: 0, generation };
    const [results, facets, options] = await Promise.all([
      get<Schema["SearchPage"]>(
        `/search?${paramsFor({ ...query, generation }, surface)}`,
      ),
      get<Schema["DiscoveryFacets"]>(
        `/discovery-facets?${paramsFor(query, surface, true)}`,
      ),
      get<Schema["DiscoveryFacets"]>(
        `/discovery-facets?${paramsFor(base, surface, true)}`,
      ),
    ]);
    if (
      [results, facets, options].some(
        (x) => x.contentVersion.generation !== generation,
      )
    )
      throw new ApiError(409);
    return { query, results, facets, options, generation };
  });
}
