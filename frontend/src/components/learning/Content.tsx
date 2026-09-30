import { PendingLink } from "./PendingLink";
import { headers } from "next/headers";
import { ApiError } from "@/api/errors";
import {
  referencePath,
  readingPath,
  safeLink,
  type Card,
  type Schema,
} from "@/learning/links";
import { readConfig } from "@/config/environment";
export function PublicLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <PendingLink href={href} className={className}>
      {children}
    </PendingLink>
  );
}
export function Unavailable({ error }: { error?: unknown }) {
  const status = error instanceof ApiError ? error.status : 503;
  return (
    <section className="notice unavailable" role="status">
      <meta name="robots" content="noindex, nofollow" />
      <p className="eyebrow">Publication availability</p>
      <h1>
        {status === 409
          ? "This material is no longer available"
          : "Learning content is temporarily unavailable"}
      </h1>
      <p>
        {status === 409
          ? "This item may have been retired or withdrawn. Return to the curriculum for the current material."
          : "The public catalog could not be loaded. It may be awaiting its first approved publication or recovering from an interruption. Unpublished drafts are not shown."}
      </p>
      <p>Wait at least 30 seconds before trying again.</p>
      <div className="actions">
        <a href="">Reload this page</a>
        <PublicLink href="/curriculum">Return to curriculum</PublicLink>
      </div>
    </section>
  );
}
export function Status({ card }: { card: Card }) {
  const lesson =
    card.visibility === "LESSON" && card.readiness === "reviewed_lesson";
  return (
    <span className={`badge ${lesson ? "ready" : "planned"}`}>
      {lesson
        ? "Reviewed lesson"
        : card.kind === "TOPIC" || card.kind === "SUBTOPIC"
          ? "Planned · outline"
          : "Curriculum map"}
    </span>
  );
}
export function Effort({ hours }: { hours: Schema["Hours"] }) {
  return (
    <p className="muted">
      {hours.min !== null && hours.max !== null
        ? `${hours.min}–${hours.max} hours · `
        : "Time not estimated · "}
      {hours.basis}
    </p>
  );
}
export function CardGrid({ cards }: { cards: Card[] }) {
  return (
    <div className="card-grid">
      {cards.map((card) => (
        <article className="catalog-card" key={card.id}>
          <p className="eyebrow">
            {card.id}
            {card.difficulty && ` · ${card.difficulty}`}
          </p>
          <h3>
            {readingPath(card.canonicalPath) ? (
              <PublicLink href={card.canonicalPath}>{card.title}</PublicLink>
            ) : (
              card.title
            )}
          </h3>
          <Status card={card} />
          <p>{card.summary}</p>
          <Effort hours={card.hours} />
        </article>
      ))}
    </div>
  );
}
export function References({
  items,
  ordered = true,
}: {
  items: Schema["Reference"][];
  ordered?: boolean;
}) {
  if (!items.length)
    return (
      <p className="muted">No published items are available in this section.</p>
    );
  const List = ordered ? "ol" : "ul";
  return (
    <List className="reference-list">
      {items.map((ref, i) => (
        <li key={`${ref.id}-${i}`}>
          <span className="eyebrow">{ref.id}</span>
          <div>
            {referencePath(ref) ? (
              <PublicLink href={referencePath(ref)!}>{ref.title}</PublicLink>
            ) : (
              <span>{ref.title}</span>
            )}{" "}
            <span className="badge">
              {ref.availability === "LESSON"
                ? "Reviewed lesson"
                : ref.availability === "MAP"
                  ? "Planned scope"
                  : ref.availability === "RETIRED"
                    ? "Retired"
                    : "Unavailable"}
            </span>
          </div>
          {ref.reason && <p>{ref.reason}</p>}
        </li>
      ))}
    </List>
  );
}
export function Preparation({ items }: { items: Schema["Prerequisite"][] }) {
  return (
    <section id="preparation">
      <h2>Preparation</h2>
      <p>
        Preparation describes the sequence of learning. It does not measure your
        progress or certify mastery.
      </p>
      {(
        [
          ["HARD", "Required for assessment"],
          ["RECOMMENDED", "Recommended preparation"],
          ["OPTIONAL", "Optional enrichment"],
        ] as const
      ).map(([strength, title]) => (
        <div key={strength}>
          <h3>{title}</h3>
          {items.some((x) => x.strength === strength) ? (
            <ul>
              {items
                .filter((x) => x.strength === strength)
                .map((x, i) => (
                  <li key={`${x.target.id}-${i}`}>
                    {referencePath(x.target) ? (
                      <PublicLink href={referencePath(x.target)!}>
                        {x.target.title}
                      </PublicLink>
                    ) : (
                      <span>
                        {x.target.title} · {x.target.availability.toLowerCase()}
                      </span>
                    )}
                    <p>{x.rationale}</p>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="muted">None specified in this publication.</p>
          )}
        </div>
      ))}
    </section>
  );
}
const priorities = [
  "Essential",
  "Very Important",
  "Recommended",
  "Useful",
  "Advanced",
  "Specialized",
  "Optional",
  "Reference",
];
export function Readings({
  assignments,
}: {
  assignments: Schema["Assignment"][];
}) {
  const ordered = [...assignments].sort(
    (a, b) =>
      (priorities.indexOf(a.priority ?? "") + 1 || 99) -
        (priorities.indexOf(b.priority ?? "") + 1 || 99) ||
      a.id.localeCompare(b.id),
  );
  return (
    <section id="readings">
      <h2>Prioritized reading</h2>
      <p>
        These are exact assignments from the publication. A resource associated
        with a whole module is not automatically an assignment for every topic.
      </p>
      {!ordered.length ? (
        <p className="notice">
          No exact reading assignment has been published for this scope.
        </p>
      ) : (
        <ul className="reading-list">
          {ordered.map((a) => (
            <li key={a.id}>
              <div className="actions">
                <span className="badge">
                  {a.priority || "Priority not specified"}
                </span>
                <span className="muted">{a.cost || "Access unknown"}</span>
              </div>
              <h3>
                {a.url && safeLink(a.url) ? (
                  <a href={safeLink(a.url)!} rel="noopener noreferrer">
                    {a.resource.title}
                    <span className="sr-only"> (external website)</span>
                  </a>
                ) : (
                  a.resource.title
                )}
              </h3>
              <p>
                <PublicLink href={`/resources/${a.resource.id}`}>
                  Source details and access limits
                </PublicLink>
                <br />
                <strong>Read:</strong> {a.scope}
              </p>
              <p>{a.purpose}</p>
              <p className="muted">
                {a.status === "REVIEWED"
                  ? `Reviewed scope: ${a.verificationScope || a.scope}`
                  : "Candidate assignment · substantive review is still pending."}
              </p>
              {!a.url && <p>Source link unavailable.</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
export function RuleNotices({ card }: { card: Card }) {
  return card.ruleNotices?.length ? (
    <aside className="notice" aria-label="Rule review status">
      <h2>Rule review status</h2>
      <p>Review metadata is not a current trading instruction.</p>
      <ul>
        {card.ruleNotices.map((r) => (
          <li key={r.ruleId}>
            {r.ruleId}:{" "}
            {r.currentOperationalEligible
              ? "Within the recorded review window"
              : "Not eligible for a current operational claim"}
            {r.reviewDueAt &&
              ` · review due ${new Date(r.reviewDueAt).toLocaleDateString("en-GB", { timeZone: "UTC" })}`}
          </li>
        ))}
      </ul>
    </aside>
  ) : null;
}
export type Crumb = { title: string; href: string };
export async function Breadcrumbs({ items }: { items: Crumb[] }) {
  const origin = readConfig(process.env).PUBLIC_ORIGIN;
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.title,
      item: origin + item.href,
    })),
  };
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="breadcrumbs">
          {items.map((item, i) => (
            <li key={item.href}>
              {i === items.length - 1 ? (
                <span aria-current="page">{item.title}</span>
              ) : (
                <PublicLink href={item.href}>{item.title}</PublicLink>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
