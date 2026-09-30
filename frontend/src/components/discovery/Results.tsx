import { PublicLink, Effort, Status } from "@/components/learning/Content";
import { readingPath, type Schema } from "@/learning/links";
export function Results({ items }: { items: Schema["SearchHit"][] }) {
  return (
    <ol className="discovery-results">
      {items.map((item) => (
        <li key={item.id}>
          <article>
            <p className="eyebrow">
              {item.kind.toLowerCase()} · {item.id}
            </p>
            <h2>
              {readingPath(item.canonicalPath) ? (
                <PublicLink href={item.canonicalPath}>{item.title}</PublicLink>
              ) : (
                item.title
              )}
            </h2>
            {item.kind !== "RESOURCE" && <Status card={item} />}
            <p>{item.rationale || item.snippet}</p>
            <p className="muted">
              {[
                item.authorOrganization,
                item.resourceType,
                item.difficulty,
                item.priority,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {item.kind === "RESOURCE" ? (
              <>
                <p>
                  <strong>Cost:</strong>{" "}
                  {item.cost === "unknown"
                    ? "Unknown — check the source before use"
                    : item.cost || "Unknown"}
                </p>
                <p className="muted">
                  {item.verificationStatus?.replaceAll("_", " ") ||
                    "No substantive review recorded"}{" "}
                  ·{" "}
                  {item.verifiedOn
                    ? `Substantive review: ${item.verifiedOn}`
                    : "Substantive review date not recorded"}
                </p>
              </>
            ) : (
              <Effort hours={item.hours} />
            )}
          </article>
        </li>
      ))}
    </ol>
  );
}
