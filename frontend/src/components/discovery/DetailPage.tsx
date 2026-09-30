import { loadDiscovery } from "@/discovery/detail";
import {
  Breadcrumbs,
  PublicLink,
  Preparation,
  References,
  Effort,
  RuleNotices,
  Unavailable,
} from "@/components/learning/Content";
import { LiveContent } from "@/components/learning/LiveContent";
import { renderStamp } from "@/learning/seo";
import { safeLink, type Schema } from "@/learning/links";
function TextList({ items }: { items: string[] | undefined }) {
  return items?.length ? (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  ) : (
    <p className="muted">Not specified in this publication.</p>
  );
}
function Resource({ item }: { item: Schema["Resource"] }) {
  return (
    <>
      <section>
        <h2>Why use this source</h2>
        <p>{item.rationale}</p>
        <p>
          <strong>Author or organization:</strong> {item.authorOrganization}
        </p>
        <p>
          {item.resourceType} · {item.geography}
        </p>
        <p>
          <strong>Publication date:</strong> {item.publicationDate || "Unknown"}
          {item.publicationDate &&
            ` (${item.datePrecision.toLowerCase()} precision)`}
        </p>
      </section>
      <section>
        <h2>Before reading</h2>
        <p>
          {item.prerequisitesText || "Prerequisites have not been recorded."}
        </p>
      </section>
      <section>
        <h2>Access and rights</h2>
        <p>
          <strong>Cost:</strong>{" "}
          {item.cost === "unknown"
            ? "Unknown — do not assume free access"
            : item.cost}
        </p>
        <p>{item.accessLimitations}</p>
        <p>{item.rights}</p>
        {item.url && safeLink(item.url) ? (
          <a
            className="button"
            href={safeLink(item.url)!}
            rel="noopener noreferrer"
          >
            Visit source (external website)
          </a>
        ) : (
          <p>
            Source link unavailable or unsupported. Use the learning material
            and alternatives below.
          </p>
        )}
        <p className="muted">
          Access can change. A source link is not proof of current availability
          or substantive review.
        </p>
      </section>
      <section>
        <h2>Verification scope and date</h2>
        <p>{item.verificationStatus.replaceAll("_", " ")}</p>
        <p>{item.freshness.verificationScope}</p>
        <dl className="metadata-list">
          <dt>Substantive review</dt>
          <dd>{item.freshness.substantiveVerifiedOn || "Not recorded"}</dd>
          <dt>Link check</dt>
          <dd>
            {item.freshness.linkCheckedAt || "Not recorded"} ·{" "}
            {item.freshness.linkStatus.toLowerCase()}
          </dd>
          <dt>Review due</dt>
          <dd>{item.freshness.reviewDueAt || "Not recorded"}</dd>
          <dt>Review status</dt>
          <dd>{item.freshness.status.replaceAll("_", " ").toLowerCase()}</dd>
        </dl>
      </section>
      <section>
        <h2>Reading assignments and relevant lessons</h2>
        <p>
          Assignments identify exact scopes. Candidate readings have not
          completed substantive review; a module association does not assign the
          source to every topic.
        </p>
        {item.assignments.length ? (
          <ul className="reading-list">
            {item.assignments.map((a) => (
              <li key={a.id}>
                <h3>{a.scope}</h3>
                <p>{a.purpose}</p>
                <p>
                  {a.status === "REVIEWED"
                    ? `Reviewed: ${a.verificationScope}`
                    : "Candidate assignment · review pending"}
                </p>
                {a.topicIds.length ? (
                  <ul>
                    {a.topicIds.map((id) => (
                      <li key={id}>
                        <PublicLink href={`/topics/${id}`}>
                          Read topic {id}
                        </PublicLink>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No exact topic has been published for this assignment.</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No exact reading assignments are published for this source.</p>
        )}
      </section>
      <section>
        <h2>Alternative sources</h2>
        {item.alternativeIds.length ? (
          <ul>
            {item.alternativeIds.map((id) => (
              <li key={id}>
                <PublicLink href={`/resources/${id}`}>
                  Inspect alternative {id}
                </PublicLink>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            No published alternative is recorded. Check access limits before
            relying on this source.
          </p>
        )}
      </section>
    </>
  );
}
function PathDetail({ item }: { item: Schema["Path"] }) {
  return (
    <>
      <aside className="notice">
        <h2>Plan your route</h2>
        <p>
          {item.unavailableReason ||
            "This is a public study sequence. It does not establish personal readiness or mastery."}
        </p>
        <p>
          Modules are shared across paths. Public next-lesson links follow the
          published order; they do not use your history, assess readiness or
          make personalized recommendations. Personalized suggestions belong to
          the later learner workflow.
        </p>
      </aside>
      <section>
        <h2>Who this path is for</h2>
        <p>{item.audience}</p>
      </section>
      <section>
        <h2>Entry criteria and preparation</h2>
        <p>{item.entryCriteria}</p>
        <p>
          Inspect each module’s required and recommended preparation before
          beginning. Reading remains open; no readiness test or enrollment is
          available here.
        </p>
      </section>
      <section>
        <h2>Exit capabilities</h2>
        <TextList items={item.exitStatements} />
        <References items={item.exitCompetencies} />
      </section>
      <section>
        <h2>Ordered module progression</h2>
        <References items={item.modules} />
      </section>
      {!!item.topics.length && (
        <section>
          <h2>Exact topic sequence</h2>
          <References items={item.topics} />
        </section>
      )}
      <section>
        <h2>Optional branches and decision rules</h2>
        <References items={item.branches ?? []} />
      </section>
      <section>
        <h2>Milestones and assessment gates</h2>
        <TextList items={item.milestones} />
        <References items={item.gates} />
        <p>Reading the sequence is not evidence of passing these gates.</p>
      </section>
      <section>
        <h2>Projects in this path</h2>
        <References items={item.projects} />
      </section>
    </>
  );
}
function Project({ item }: { item: Schema["Project"] }) {
  return (
    <>
      <section>
        <h2>Learning objective</h2>
        <p>{item.objective}</p>
      </section>
      <Preparation items={item.prerequisites} />
      <section>
        <h2>Lawful data plan</h2>
        <p>{item.dataPlan}</p>
        <p>
          A data plan is not a download or a license. Verify any required
          entitlement before using external data.
        </p>
      </section>
      <section>
        <h2>Work sequence</h2>
        <TextList items={item.steps} />
      </section>
      <section>
        <h2>Deliverables</h2>
        <p>{item.deliverables}</p>
      </section>
      <section>
        <h2>Assessment criteria</h2>
        <TextList items={item.assessmentCriteria} />
        <p>
          These are published rubric criteria, not scored feedback. Submission
          and assessed mastery are not available in this release.
        </p>
      </section>
      <section>
        <h2>Noncoding route</h2>
        <TextList items={item.noncodingRoute} />
      </section>
      <section>
        <h2>Limitations</h2>
        <TextList items={item.limitations} />
      </section>
    </>
  );
}
export async function DetailPage({
  kind,
  slug,
}: {
  kind: string;
  slug: string;
}) {
  const result = await loadDiscovery(kind, slug);
  if (!result.data) return <Unavailable error={result.error} />;
  const item = result.data;
  const parent =
    item.kind === "RESOURCE"
      ? "resources"
      : item.kind === "PATH"
        ? "paths"
        : ["PROJECT", "CAPSTONE"].includes(item.kind)
          ? "projects"
          : "search";
  return (
    <LiveContent
      generation={item.contentVersion.generation}
      stamp={await renderStamp()}
    >
      <Breadcrumbs
        items={[
          { title: "Home", href: "/" },
          {
            title:
              parent === "resources"
                ? "Resource library"
                : parent === "paths"
                  ? "Learning paths"
                  : parent === "projects"
                    ? "Projects and capstones"
                    : "Search",
            href: `/${parent}`,
          },
          { title: item.title, href: item.canonicalPath },
        ]}
      />
      <header className="page-heading">
        <p className="eyebrow">
          {item.kind.toLowerCase()} · {item.id}
          {item.difficulty && ` · ${item.difficulty}`}
        </p>
        <h1>{item.title}</h1>
        <p className="lead">{item.summary}</p>
        {item.kind !== "RESOURCE" && (
          <>
            <span className="badge planned">
              {item.readiness.replaceAll("_", " ")}
            </span>
            <Effort hours={item.hours} />
          </>
        )}
      </header>
      <div className="reading-width discovery-detail">
        <RuleNotices card={item} />
        {item.kind === "RESOURCE" ? (
          <Resource item={item} />
        ) : item.kind === "PATH" ? (
          <PathDetail item={item} />
        ) : item.kind === "PROJECT" ? (
          <Project item={item} />
        ) : item.kind === "CAPSTONE" ? (
          <>
            <Preparation items={item.prerequisites} />
            <section>
              <h2>Capstone brief</h2>
              <p>{item.brief}</p>
              <h2>Capability projects</h2>
              <ul>
                {item.projectIds.map((id) => (
                  <li key={id}>
                    <PublicLink href={`/projects/${id}`}>{id}</PublicLink>
                  </li>
                ))}
              </ul>
              <p>
                Assessment policy: {item.assessmentPolicyId}. This description
                does not provide an executable assessment or solutions.
              </p>
            </section>
          </>
        ) : item.kind === "EXERCISE" ? (
          <section>
            <h2>Exercise description</h2>
            <p>
              {item.exerciseType} practice · execution unavailable in this
              release.
            </p>
            <ul>
              {item.topicIds.map((id) => (
                <li key={id}>
                  <PublicLink href={`/topics/${id}`}>Topic {id}</PublicLink>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <section>
            <h2>Assessment description</h2>
            <p>{item.purpose}</p>
            <p>
              {item.itemCount} planned items · target pass score{" "}
              {item.passScore}. Attempts and protected solutions are unavailable
              here.
            </p>
          </section>
        )}
      </div>
    </LiveContent>
  );
}
