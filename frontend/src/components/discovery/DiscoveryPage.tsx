import { discover } from "@/discovery/catalog";
import {
  surfaces,
  filters,
  pageHref,
  QueryIssue,
  type Surface,
  type Filter,
} from "@/discovery/query";
import { ApiError } from "@/api/errors";
import {
  Breadcrumbs,
  PublicLink,
  Unavailable,
} from "@/components/learning/Content";
import { LiveContent } from "@/components/learning/LiveContent";
import { renderStamp } from "@/learning/seo";
import { FilterForm } from "./FilterForm";
import { Results } from "./Results";
export async function DiscoveryPage({
  surface,
  raw,
}: {
  surface: Surface;
  raw: Record<string, string | string[] | undefined>;
}) {
  let data;
  try {
    data = await discover(surface, raw);
  } catch (error) {
    if (
      error instanceof QueryIssue ||
      (error instanceof ApiError && [400, 409, 422].includes(error.status))
    )
      return (
        <section className="notice">
          <meta name="robots" content="noindex, nofollow" />
          <h1>Review your search</h1>
          <p>
            {error instanceof QueryIssue
              ? error.message
              : error.status === 409
                ? "The publication changed. Restart from the first page to see current results."
                : "One or more filters are unavailable. Clear the query and choose values from the current catalog."}
          </p>
          <a href={`/${surface}`}>Reset search</a>
        </section>
      );
    return <Unavailable error={error} />;
  }
  const { query, results, facets, options, generation } = data;
  const config = surfaces[surface];
  return (
    <LiveContent generation={generation} stamp={await renderStamp()}>
      <Breadcrumbs
        items={[
          { title: "Home", href: "/" },
          { title: config.title, href: `/${surface}` },
        ]}
      />
      <header className="page-heading">
        <p className="eyebrow">Published catalog</p>
        <h1>{config.title}</h1>
        <p className="lead">{config.description}</p>
      </header>
      <FilterForm
        key={JSON.stringify(query)}
        surface={surface}
        query={query}
        facets={facets}
        options={options}
      />
      {Object.keys(query.values).length > 0 && (
        <section aria-label="Applied filters" className="applied-filters">
          {Object.entries(query.values).flatMap(([key, values]) =>
            values.map((value) => {
              const next = {
                ...query,
                values: {
                  ...query.values,
                  [key]: values.filter((v) => v !== value),
                },
              };
              return (
                <PublicLink
                  key={key + value}
                  href={pageHref(surface, next, 0, generation)}
                >
                  Remove {filters[key as Filter]}: {value}
                </PublicLink>
              );
            }),
          )}
        </section>
      )}
      <p role="status">
        {results.total} published results · Page {query.page + 1}
        {results.items.length
          ? ` · Showing ${query.page * query.limit + 1}–${query.page * query.limit + results.items.length}`
          : ""}
      </p>
      {results.items.length ? (
        <Results items={results.items} />
      ) : (
        <section className="notice">
          <h2>No matching published content</h2>
          <p>
            Try fewer filters or a broader search. Planned and reviewed material
            are labeled separately; unpublished content is excluded.
          </p>
          <a href={`/${surface}`}>Clear filters and search</a>
        </section>
      )}
      <nav aria-label="Results pages" className="pagination">
        {query.page > 0 && (
          <PublicLink
            href={pageHref(surface, query, query.page - 1, generation)}
          >
            Previous page
          </PublicLink>
        )}
        {results.hasMore && query.page < 99 && (
          <PublicLink
            href={pageHref(surface, query, query.page + 1, generation)}
          >
            Next page
          </PublicLink>
        )}
        {results.hasMore && query.page === 99 && (
          <p>Narrow your search to see more specific results.</p>
        )}
      </nav>
    </LiveContent>
  );
}
