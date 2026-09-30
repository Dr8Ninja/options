"use client";
import { useState } from "react";
import {
  filters,
  type Filter,
  type Query,
  type Surface,
} from "@/discovery/query";
import type { Schema } from "@/learning/links";
export function FilterForm({
  surface,
  query,
  facets,
  options,
}: {
  surface: Surface;
  query: Query;
  facets: Schema["DiscoveryFacets"];
  options: Schema["DiscoveryFacets"];
}) {
  const [pending, setPending] = useState(false);
  return (
    <form
      action={`/${surface}`}
      method="get"
      className="discovery-form"
      onSubmit={() => setPending(true)}
    >
      <div className="search-row">
        <label>
          Search titles, IDs or text
          <input
            name="q"
            type="search"
            maxLength={200}
            defaultValue={query.q}
          />
        </label>
        <button type="submit">Search</button>
      </div>
      <details className="filter-panel">
        <summary>
          Refine results · {Object.values(query.values).flat().length} applied
        </summary>
        <p>
          Select one or more values in each filter. Values within a filter are
          alternatives; different filters must all match. Hold Control or
          Command to select multiple values on a desktop.
        </p>
        <div className="filter-grid">
          {(Object.keys(filters) as Filter[])
            .filter((k) => surface === "search" || k !== "kind")
            .map((name) => {
              const choices = options[name] ?? [];
              const selected = query.values[name] ?? [];
              const counts = new Map(
                (facets[name] ?? []).map((x) => [x.value, x.count]),
              );
              const extra = selected.filter(
                (v) => !choices.some((x) => x.value === v),
              );
              if (!choices.length && !selected.length) return null;
              return (
                <div key={name}>
                  <label htmlFor={`filter-${name}`}>{filters[name]}</label>
                  <select
                    id={`filter-${name}`}
                    name={name}
                    multiple
                    size={3}
                    defaultValue={selected}
                  >
                    {choices.map((x) => (
                      <option key={x.value} value={x.value}>
                        {x.label} ({counts.get(x.value) ?? 0})
                      </option>
                    ))}
                    {extra.map((v) => (
                      <option key={v} value={v}>
                        {v} (0)
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
        </div>
        <label>
          Additional topic ID
          <input
            name="topic"
            aria-describedby="topic-id-help"
            maxLength={160}
          />
        </label>
        <p id="topic-id-help" className="muted">
          Facet lists show up to 100 values. Enter an exact published topic ID
          here if it is outside the list; it is combined with other selected
          topic values.
        </p>
      </details>
      <div className="search-row">
        <label>
          Sort by
          <select name="sort" defaultValue={query.sort}>
            <option value="relevance">Relevance</option>
            <option value="title">Title A–Z</option>
            <option value="-title">Title Z–A</option>
            <option value="priority">Editorial priority</option>
            <option value="duration">Estimated effort</option>
            <option value="-verified">Substantive review date</option>
          </select>
        </label>
        <label>
          Results per page
          <select name="limit" defaultValue={String(query.limit)}>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </label>
        <button type="submit">Apply filters</button>
        <a href={`/${surface}`}>Clear all</a>
      </div>
      {pending && <p role="status">Loading published results…</p>}
    </form>
  );
}
