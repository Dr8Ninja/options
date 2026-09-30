export const filters = {
  kind: "Content type",
  difficulty: "Difficulty",
  resourceType: "Resource type",
  cost: "Cost",
  priority: "Priority",
  topic: "Topic",
  tag: "Tag",
  phase: "Phase",
  module: "Module",
  source: "Source",
  path: "Learning path",
  geography: "Geography",
  verificationStatus: "Verification scope",
  readiness: "Editorial readiness",
  visibility: "Publication type",
} as const;
export type Filter = keyof typeof filters;
export type Surface = "resources" | "paths" | "projects" | "search";
export const surfaces: Record<
  Surface,
  { title: string; description: string; kinds: string[] }
> = {
  resources: {
    title: "Resource library",
    description:
      "Find a source for a specific learning need. Check access limits and the scope of its review before reading.",
    kinds: ["RESOURCE"],
  },
  paths: {
    title: "Learning paths",
    description:
      "Choose a route by your starting point and intended capabilities. Shared modules retain the same content and prerequisites across paths.",
    kinds: ["PATH"],
  },
  projects: {
    title: "Projects and capstones",
    description:
      "Apply the prerequisites to a concrete deliverable. Inspect the data plan, assessment criteria and limitations before beginning.",
    kinds: ["PROJECT", "CAPSTONE"],
  },
  search: {
    title: "Search the curriculum",
    description:
      "Search published titles, IDs and text. Exact ID and title matches come first, followed by text relevance. Planned material is labeled.",
    kinds: [],
  },
};
export class QueryIssue extends Error {}
export type Query = {
  q: string;
  sort: string;
  limit: number;
  page: number;
  generation?: string;
  values: Partial<Record<Filter, string[]>>;
};
export function parseQuery(
  raw: Record<string, string | string[] | undefined>,
  surface: Surface,
): Query {
  const scalar = (key: string, fallback: string) => {
    const value = raw[key];
    if (Array.isArray(value)) throw new QueryIssue(`Use one ${key} value.`);
    return value ?? fallback;
  };
  for (const key of Object.keys(raw))
    if (
      ![
        "q",
        "sort",
        "limit",
        "page",
        "generation",
        ...Object.keys(filters),
      ].includes(key)
    )
      throw new QueryIssue("Remove the unsupported query parameter.");
  const q = scalar("q", "").trim();
  if ([...q].length > 200)
    throw new QueryIssue("Keep the search to 200 characters or fewer.");
  const sort = scalar(
    "sort",
    surface === "resources"
      ? "priority"
      : surface === "search"
        ? "relevance"
        : "title",
  );
  if (
    ![
      "relevance",
      "title",
      "-title",
      "duration",
      "priority",
      "-verified",
    ].includes(sort)
  )
    throw new QueryIssue("Choose an available sort order.");
  const size = scalar("limit", "20"),
    page = scalar("page", "0"),
    generation = scalar("generation", "");
  if (!["20", "50"].includes(size) || !/^\d{1,2}$/.test(page))
    throw new QueryIssue("Use 20 or 50 results and a page between 1 and 100.");
  if (generation && !/^\d{1,20}$/.test(generation))
    throw new QueryIssue("Restart pagination from the first page.");
  if (Number(page) > 0 && !generation)
    throw new QueryIssue("Restart pagination from the first page.");
  const values: Query["values"] = {};
  for (const name of Object.keys(filters) as Filter[]) {
    const v = raw[name];
    if (v === undefined) continue;
    const a = [
      ...new Set(
        (Array.isArray(v) ? v : [v]).map((x) => x.trim()).filter(Boolean),
      ),
    ];
    if (
      a.length > 10 ||
      a.some(
        (x) =>
          [...x].length > (["source", "geography"].includes(name) ? 2000 : 160),
      )
    )
      throw new QueryIssue(`Check the ${filters[name].toLowerCase()} filter.`);
    if (a.length) values[name] = a;
  }
  if (surface !== "search" && values.kind)
    throw new QueryIssue("Use global search to change the content type.");
  return {
    q,
    sort,
    limit: Number(size),
    page: Number(page),
    generation: generation || undefined,
    values,
  };
}
export function paramsFor(query: Query, surface: Surface, facet = false) {
  const p = new URLSearchParams();
  if (query.q) p.set("q", query.q);
  for (const [key, values] of Object.entries(query.values))
    for (const value of values) p.append(key, value);
  for (const kind of surfaces[surface].kinds) p.append("kind", kind);
  if (facet) p.set("entity", "search");
  else {
    p.set("sort", query.sort);
    p.set("limit", String(query.limit));
    p.set("page", String(query.page));
    if (query.generation) p.set("generation", query.generation);
  }
  return p;
}
export function pageHref(
  surface: Surface,
  query: Query,
  page: number,
  generation: string,
) {
  const p = paramsFor({ ...query, page, generation }, "search");
  return `/${surface}?${p}`;
}
