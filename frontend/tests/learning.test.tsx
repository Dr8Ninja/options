import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
import { AuthoredMarkdown } from "@/components/learning/Markdown";
import {
  References,
  Preparation,
  Readings,
} from "@/components/learning/Content";
import {
  indexable,
  safeLink,
  readingPath,
  type Schema,
} from "@/learning/links";
const ref: Schema["Reference"] = {
  id: "TEST-1",
  title: "Test preparation",
  kind: "TOPIC",
  revision: "rev-test",
  availability: "MAP",
};
describe("public reading boundaries", () => {
  it("rejects executable, private and cross-origin-shaped local links", () => {
    for (const value of [
      "javascript:alert(1)",
      "data:text/html,x",
      "http://unsafe.invalid",
      "//unsafe.invalid",
      "/me/notes",
      "/topics/../admin",
      "https://name:password@unsafe.invalid",
    ])
      expect(safeLink(value)).toBeNull();
    expect(safeLink("https://example.org/guide")).toBe(
      "https://example.org/guide",
    );
    expect(readingPath("/topics/stable-slug")).toBe("/topics/stable-slug");
  });
  it("requires explicit approval and reviewed instruction for topic indexing", () => {
    const base = {
      kind: "TOPIC",
      visibility: "MAP",
      readiness: "scope_outline",
      indexable: true,
    } as Schema["Card"];
    expect(indexable(base)).toBe(false);
    expect(
      indexable({
        ...base,
        visibility: "LESSON",
        readiness: "reviewed_lesson",
      }),
    ).toBe(true);
    expect(indexable({ ...base, kind: "MODULE", indexable: false })).toBe(
      false,
    );
  });
  it("shows unavailable references without working links or completion controls", () => {
    render(<References items={[{ ...ref, availability: "RETIRED" }]} />);
    expect(screen.getByText("Retired")).toBeVisible();
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });
  it("separates required, recommended and optional preparation", () => {
    render(
      <Preparation
        items={[
          { target: ref, strength: "HARD", rationale: "Learn the unit first." },
        ]}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Required for assessment" }),
    ).toBeVisible();
    expect(screen.getByText("Learn the unit first.")).toBeVisible();
  });
  it("renders reviewed scope without promoting candidate resources", () => {
    render(
      <Readings
        assignments={[
          {
            id: "A1",
            resource: ref,
            topicIds: [],
            competencyIds: [],
            scope: "Section 2",
            purpose: "Practice units",
            status: "CANDIDATE",
            verificationScope: null,
            url: "https://example.org/",
            priority: "Essential",
            cost: "free",
          },
        ]}
      />,
    );
    expect(
      screen.getByText(/substantive review is still pending/),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /external website/ }),
    ).toHaveAttribute("rel", "noopener noreferrer");
  });
  it("renders safe math, tables and inert code while stripping executable HTML and remote images", () => {
    const html = renderToStaticMarkup(
      <AuthoredMarkdown
        source={
          '## Units\n\n$x^2$\n\n| Unit | Value |\n| --- | --- |\n| x | 2 |\n\n```js\nalert("inert")\n```\n\n<script>alert("unsafe")</script>\n\n[unsafe](javascript:alert(1))\n\n![Diagram equivalent text](https://unsafe.invalid/a.png)'
        }
      />,
    );
    expect(html).toContain("<math");
    expect(html).toContain("<table");
    expect(html).toContain("Code example (not executed)");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("<img");
    expect(html).not.toContain('href="javascript:');
    expect(html).toContain("Diagram equivalent text");
  });
  it("bounds excessive authored input and macro expansion", () => {
    expect(
      renderToStaticMarkup(<AuthoredMarkdown source={"x".repeat(100001)} />),
    ).toContain("cannot be displayed safely");
    const html = renderToStaticMarkup(
      <AuthoredMarkdown source={"$\\def\\a{\\a}\\a$"} />,
    );
    expect(html).not.toContain("<script");
    expect(html.length).toBeLessThan(10000);
  });
});
