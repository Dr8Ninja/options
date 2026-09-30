import React, { type ReactNode } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeKatex from "rehype-katex";
import { safeLink } from "@/learning/links";
import { CopyCode } from "./CopyCode";
export const RENDERER_VERSION = "restricted-markdown-1";
function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (React.isValidElement<{ children?: ReactNode }>(node))
    return textOf(node.props.children);
  return "";
}
const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [["className", /^language-./, "math-inline", "math-display"]],
  },
  protocols: { href: ["https"] },
};
export function AuthoredMarkdown({ source }: { source: string }) {
  // Rendering is deliberately bounded; content code, raw HTML and remote media are never executed.
  if (
    source.length > 100000 ||
    [...source.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$\n]+)\$/g)].some(
      (m) => m[0].length > 2000,
    )
  )
    return (
      <p className="notice">
        This lesson cannot be displayed safely. Please return to the curriculum.
      </p>
    );
  let heading = 0;
  return (
    <div className="authored" data-renderer={RENDERER_VERSION}>
      <Markdown
        skipHtml
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          [rehypeSanitize, schema],
          [
            rehypeKatex,
            {
              trust: false,
              strict: "error",
              output: "htmlAndMathml",
              maxSize: 20,
              maxExpand: 200,
              throwOnError: false,
              errorColor: "currentColor",
            },
          ],
        ]}
        urlTransform={(url) => safeLink(url) ?? ""}
        components={{
          span: ({ className, children, style, "aria-hidden": ariaHidden }) => (
            <span
              style={style}
              aria-hidden={ariaHidden}
              className={className}
              {...(className?.split(" ").includes("katex-display")
                ? {
                    tabIndex: 0,
                    role: "region",
                    "aria-label":
                      "Lesson formula; scroll horizontally if needed",
                  }
                : {})}
            >
              {children}
            </span>
          ),
          h1: ({ children }) => (
            <h2 id={`lesson-section-${++heading}`}>{children}</h2>
          ),
          h2: ({ children }) => (
            <h2 id={`lesson-section-${++heading}`}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 id={`lesson-section-${++heading}`}>{children}</h3>
          ),
          a: ({ href, children }) =>
            href ? (
              <a
                href={href}
                rel={
                  href.startsWith("https:") ? "noopener noreferrer" : undefined
                }
              >
                {children}
                {href.startsWith("https:") && (
                  <span className="sr-only"> (external website)</span>
                )}
              </a>
            ) : (
              <span>{children}</span>
            ),
          img: ({ alt }) => (
            <span className="image-alternative">
              {alt || "Image unavailable: no approved local asset is attached."}
            </span>
          ),
          table: ({ children }) => (
            <div
              className="table-scroll"
              role="region"
              aria-label="Lesson table; scroll horizontally if needed"
              tabIndex={0}
            >
              <table>{children}</table>
            </div>
          ),
          pre: ({ children }) => (
            <div className="code-block">
              <pre tabIndex={0} aria-label="Code example (not executed)">
                {children}
              </pre>
              <CopyCode text={textOf(children)} />
            </div>
          ),
          blockquote: ({ children }) => (
            <aside className="teaching-block">{children}</aside>
          ),
        }}
      >
        {source}
      </Markdown>
    </div>
  );
}
