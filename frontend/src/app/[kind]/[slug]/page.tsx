import { discoveryKinds, loadDiscovery } from "@/discovery/detail";
import { DetailPage } from "@/components/discovery/DetailPage";
import { cache } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { ApiError } from "@/api/errors";
import {
  detail,
  moduleDetail,
  topic,
  resolve,
  get,
  consistent,
  ensureGeneration,
} from "@/learning/catalog";
import {
  readingKinds,
  readingPath,
  referencePath,
  type ReadingKind,
  type Schema,
  type Card,
} from "@/learning/links";
import { cardMetadata, metadata, renderStamp } from "@/learning/seo";
import {
  Breadcrumbs,
  CardGrid,
  Unavailable,
  PublicLink,
  References,
  Preparation,
  Readings,
  Status,
  Effort,
  RuleNotices,
  type Crumb,
} from "@/components/learning/Content";
import { AuthoredMarkdown } from "@/components/learning/Markdown";
import { LiveContent } from "@/components/learning/LiveContent";
type Props = { params: Promise<{ kind: string; slug: string }> };
const load = cache(async (kind: string, slug: string) => {
  if (
    !readingKinds.includes(kind as ReadingKind) ||
    !readingPath(`/${kind}/${slug}`)
  )
    notFound();
  let route: Schema["RouteResolution"];
  try {
    route = await resolve(`/${kind}/${slug}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    return { error };
  }
  if (route.status === "RETIRED") return { error: new ApiError(409) };
  if (!readingPath(route.canonicalPath)) return { error: new ApiError(503) };
  if (route.status === "RENAMED") permanentRedirect(route.canonicalPath);
  try {
    const data = await consistent(async (generation) => {
      const card = await detail(kind as ReadingKind, route.id);
      if (card.contentVersion.generation !== generation)
        throw new ApiError(503);
      return card;
    });
    return { data };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    return { error };
  }
});
export async function generateMetadata({ params }: Props) {
  const { kind, slug } = await params;
  const result = (discoveryKinds as readonly string[]).includes(kind)
    ? await loadDiscovery(kind, slug)
    : await load(kind, slug);
  return result.data
    ? cardMetadata(result.data)
    : metadata(
        "Material unavailable",
        "This material is not currently available in the public curriculum.",
        `/${kind}/${slug}`,
        false,
      );
}
export default async function ReadingPage({ params }: Props) {
  const { kind, slug } = await params;
  if ((discoveryKinds as readonly string[]).includes(kind))
    return <DetailPage kind={kind} slug={slug} />;
  const result = await load(kind, slug);
  if (!result.data) return <Unavailable error={result.error} />;
  const card = result.data;
  const prepared = await assemble(card, kind).then(
    (data) => ({ data, error: null }),
    (error) => ({ data: null, error }),
  );
  if (!prepared.data) return <Unavailable error={prepared.error} />;
  const {
    parentModule,
    topicCards,
    moduleCards,
    crumbs,
    curriculumModule,
    lesson,
    topicCard,
    reviewed,
    next,
    nextLesson,
    sections,
  } = prepared.data;
  return (
    <LiveContent
      generation={card.contentVersion.generation}
      stamp={await renderStamp()}
    >
      <Breadcrumbs items={crumbs} />
      <header className="page-heading">
        <p className="eyebrow">
          {card.id} {card.difficulty && ` / ${card.difficulty}`}
        </p>
        <Status card={card} />
        <h1>{card.title}</h1>
        <p className="lead">{card.summary}</p>
        <Effort hours={card.hours} />
      </header>
      <div className="reading-layout">
        <aside className="outline">
          <details open>
            <summary>On this page</summary>
            <nav aria-label="On this page">
              <ul>
                {sections.map((s) => (
                  <li key={s}>
                    <a href={`#${s}`}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
          <p className="muted">
            Catalog updated{" "}
            {new Date(card.contentVersion.asOf).toLocaleDateString("en-GB", {
              timeZone: "UTC",
            })}
            . Availability is checked while this page is open.
          </p>
        </aside>
        <article className="reading-content">
          <RuleNotices card={card} />
          {kind === "programs" && (
            <section id="reading">
              <h2>About this curriculum</h2>
              <p>{(card as Schema["Program"]).qualification}</p>
              <References items={(card as Schema["Program"]).phases} />
            </section>
          )}
          {kind === "phases" && (
            <section id="reading">
              <h2>Modules in this phase</h2>
              <p>
                Follow the published order and check each module’s preparation
                before moving on.
              </p>
              <CardGrid
                cards={(card as Schema["Phase"]).modules.flatMap((ref) =>
                  moduleCards.filter((c) => c.id === ref.id),
                )}
              />
            </section>
          )}
          {curriculumModule && (
            <>
              <section id="objectives">
                <h2>Why this module matters</h2>
                <p>
                  {curriculumModule.whyItMatters || curriculumModule.summary}
                </p>
                <h2>Learning objectives</h2>
                <ul>
                  {curriculumModule.objectives.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
                <h3>Competencies</h3>
                <References
                  items={curriculumModule.competencies}
                  ordered={false}
                />
              </section>
              <Preparation items={curriculumModule.prerequisites} />
              <section id="topics">
                <h2>Topics in order</h2>
                <p>
                  {
                    curriculumModule.topics.filter(
                      (t) => t.availability === "LESSON",
                    ).length
                  }{" "}
                  reviewed lessons among {curriculumModule.topics.length}{" "}
                  published topic references. Planned scopes are not completed
                  lessons.
                </p>
                <ol className="reference-list">
                  {curriculumModule.topics.map((ref) => (
                    <li key={ref.id}>
                      <h3>
                        {referencePath(ref) ? (
                          <PublicLink
                            href={
                              topicCards.find((t) => t.id === ref.id)
                                ?.canonicalPath || referencePath(ref)!
                            }
                          >
                            {ref.title}
                          </PublicLink>
                        ) : (
                          ref.title
                        )}
                      </h3>
                      <span className="badge">
                        {ref.availability === "LESSON"
                          ? "Reviewed lesson"
                          : ref.availability === "MAP"
                            ? "Planned · outline"
                            : ref.availability.toLowerCase()}
                      </span>
                      <p>{topicCards.find((t) => t.id === ref.id)?.summary}</p>
                    </li>
                  ))}
                </ol>
              </section>
              <section>
                <h2>Common mistakes</h2>
                <ul>
                  {curriculumModule.commonMistakes?.map((mistake, i) => (
                    <li key={i}>{mistake}</li>
                  ))}
                </ul>
              </section>
              <Readings assignments={curriculumModule.assignments} />
              <section id="mastery">
                <h2>Practice and mastery</h2>
                <p>
                  Use the objectives to guide your study. Reading these topics
                  does not mark the module mastered. Scored assessments and
                  progress tracking are not available in this release.
                </p>
              </section>
            </>
          )}
          {lesson && (
            <section id="reading">
              <h2>{reviewed ? "Lesson" : "Planned scope"}</h2>
              {reviewed && lesson.lessonMarkdown ? (
                <AuthoredMarkdown source={lesson.lessonMarkdown} />
              ) : (
                <>
                  <p className="notice">
                    This is an outline of intended coverage. It is not a
                    completed or reviewed lesson.
                  </p>
                  <p>{lesson.scopeOutline}</p>
                </>
              )}
            </section>
          )}
          {topicCard && (
            <>
              <Preparation items={topicCard.prerequisites} />
              <section id="subtopics">
                <h2>Scope units</h2>
                <References items={topicCard.subtopics} />
              </section>
              <Readings assignments={topicCard.assignments} />
              <section id="practice">
                <h2>Practice and mastery</h2>
                <p>
                  {topicCard.exercises.length
                    ? `${topicCard.exercises.length} exercise descriptions are associated with this topic. Interactive practice and assessment are not available yet.`
                    : "No exercise has been published for this topic."}
                </p>
                <ul>
                  {topicCard.exercises.map((x) => (
                    <li key={x.id}>{x.title} · description only</li>
                  ))}
                </ul>
                <p>
                  Reading or working through an example does not create assessed
                  mastery.
                </p>
              </section>
              <section id="next">
                <h2>Continue in sequence</h2>
                {nextLesson && (
                  <p>
                    <PublicLink href={referencePath(nextLesson)!}>
                      Next reviewed lesson: {nextLesson.title}
                    </PublicLink>
                  </p>
                )}
                {next && next.id !== nextLesson?.id && (
                  <p>
                    <PublicLink href={referencePath(next)!}>
                      Next planned topic: {next.title}
                    </PublicLink>
                  </p>
                )}
                {!next && (
                  <p>
                    No further topic is available in this module’s published
                    sequence.
                  </p>
                )}
                {parentModule && (
                  <PublicLink href={parentModule.canonicalPath}>
                    Return to {parentModule.title}
                  </PublicLink>
                )}
              </section>
            </>
          )}
        </article>
      </div>
    </LiveContent>
  );
}

async function assemble(
  card: Awaited<ReturnType<typeof detail>>,
  kind: string,
) {
  let parentModule: Schema["Module"] | undefined;
  let topicParent: Schema["Topic"] | undefined;
  const topicCards: Card[] = [];
  const moduleCards: Card[] = [];
  if (kind === "phases") {
    let cursor: string | null | undefined;
    for (let page = 0; page < 2; page++) {
      const rows: Schema["CatalogPage"] = await get(
        `/modules?phase=${encodeURIComponent(card.id)}&limit=50${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
      );
      if (rows.contentVersion.generation !== card.contentVersion.generation)
        throw new ApiError(503);
      moduleCards.push(...rows.items);
      cursor = rows.nextCursor;
      if (!cursor) break;
    }
    if (cursor) throw new ApiError(503);
  }
  if (kind === "topics") {
    const ref = (card as Schema["Topic"]).module;
    if (ref && referencePath(ref)) parentModule = await moduleDetail(ref.id);
  }
  if (kind === "subtopics") {
    const ref = (card as Schema["Subtopic"]).topic;
    if (referencePath(ref)) topicParent = await topic(ref.id);
  }
  if (kind === "modules") {
    let cursor: string | null | undefined;
    for (let page = 0; page < 4; page++) {
      const next: Schema["CatalogPage"] = await get(
        `/topics?module=${encodeURIComponent(card.id)}&limit=50${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
      );
      if (next.contentVersion.generation !== card.contentVersion.generation)
        throw new ApiError(503);
      topicCards.push(...next.items);
      cursor = next.nextCursor;
      if (!cursor) break;
    }
    if (cursor) throw new ApiError(503);
  }
  const crumbs: Crumb[] = [
    { title: "Home", href: "/" },
    { title: "Curriculum", href: "/curriculum" },
  ];
  const phaseRef =
    kind === "modules" ? (card as Schema["Module"]).phase : parentModule?.phase;
  if (phaseRef && referencePath(phaseRef))
    crumbs.push({ title: phaseRef.title, href: referencePath(phaseRef)! });
  if (parentModule)
    crumbs.push({
      title: parentModule.title,
      href: parentModule.canonicalPath,
    });
  if (topicParent)
    crumbs.push({
      title: topicParent.title,
      href: topicParent.canonicalPath,
    });
  crumbs.push({ title: card.title, href: card.canonicalPath });
  const curriculumModule =
    kind === "modules" ? (card as Schema["Module"]) : undefined;
  const lesson =
    kind === "topics" || kind === "subtopics"
      ? (card as Schema["Topic"] | Schema["Subtopic"])
      : undefined;
  const topicCard = kind === "topics" ? (card as Schema["Topic"]) : undefined;
  const reviewed =
    lesson?.visibility === "LESSON" && lesson.readiness === "reviewed_lesson";
  const sequence = parentModule?.topics ?? [];
  const index = sequence.findIndex((t) => t.id === card.id);
  const next =
    index >= 0
      ? sequence.slice(index + 1).find((t) => referencePath(t))
      : undefined;
  const nextLesson =
    index >= 0
      ? sequence
          .slice(index + 1)
          .find((t) => t.availability === "LESSON" && referencePath(t))
      : undefined;
  const sections = curriculumModule
    ? ["objectives", "preparation", "topics", "readings", "mastery"]
    : topicCard
      ? ["reading", "preparation", "subtopics", "readings", "practice", "next"]
      : ["reading"];
  if (
    [parentModule, topicParent].some(
      (p) =>
        p && p.contentVersion.generation !== card.contentVersion.generation,
    )
  )
    throw new ApiError(503);
  await ensureGeneration(card.contentVersion.generation);
  return {
    parentModule,
    topicCards,
    moduleCards,
    crumbs,
    curriculumModule,
    lesson,
    topicCard,
    reviewed,
    next,
    nextLesson,
    sections,
  };
}
