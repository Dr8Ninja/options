import { describe, it, expect, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { parseQuery, paramsFor, pageHref } from "@/discovery/query";
import { readingPath, referencePath, safeLink } from "@/learning/links";
describe("public discovery URL state", () => {
  it("preserves combined and repeated values without altering labels", () => {
    const q = parseQuery(
      {
        cost: ["free", "unknown"],
        difficulty: "Beginner / Intermediate",
        source: "A & B",
        q: "cash flow",
      },
      "resources",
    );
    const p = paramsFor(q, "resources");
    expect(p.getAll("cost")).toEqual(["free", "unknown"]);
    expect(p.get("kind")).toBe("RESOURCE");
    expect(p.get("source")).toBe("A & B");
    expect(p.get("difficulty")).toBe("Beginner / Intermediate");
  });
  it("binds pages to a generation and preserves filters in previous and next links", () => {
    const q = parseQuery({ cost: "free", limit: "50" }, "resources");
    const href = pageHref("resources", q, 1, "7");
    expect(href).toContain("cost=free");
    expect(href).toContain("page=1");
    expect(href).toContain("generation=7");
    expect(href).not.toContain("kind=");
  });
  it("rejects malformed, oversized and unsupported input", () => {
    for (const q of [
      { sort: "title;drop" },
      { limit: "500" },
      { page: "100" },
      { page: "1" },
      { q: "a".repeat(201) },
      { sort: ["title", "duration"] },
      { private: "true" },
      { kind: "TOPIC" },
    ])
      expect(() => parseQuery(q, "resources")).toThrow();
  });
  it("only forwards filter and query parameters to facets", () => {
    const q = parseQuery(
      { cost: "free", page: "1", generation: "7" },
      "resources",
    );
    const p = paramsFor(q, "resources", true);
    expect(p.get("entity")).toBe("search");
    for (const key of ["sort", "page", "limit", "generation"])
      expect(p.has(key)).toBe(false);
  });
  it("links public quiz prerequisites to their implemented description route", () => {
    expect(
      referencePath({
        id: "QZ1",
        kind: "QUIZ",
        title: "Quiz",
        revision: "rev-test",
        availability: "MAP",
      }),
    ).toBe("/quizzes/QZ1");
  });
  it("admits implemented public details while rejecting private and executable links", () => {
    for (const path of [
      "/resources/R01",
      "/paths/PATH-BEGINNER",
      "/projects/PR01",
      "/capstones/C1",
      "/exercises/E1",
      "/quizzes/Q1",
    ])
      expect(readingPath(path)).toBe(path);
    for (const path of [
      "/admin/x",
      "/me/x",
      "/resources/../admin",
      "javascript:x",
    ])
      expect(safeLink(path)).toBeNull();
  });
});
