import { overview } from "@/learning/catalog";
import { metadata, renderStamp } from "@/learning/seo";
import {
  Unavailable,
  PublicLink,
  CardGrid,
} from "@/components/learning/Content";
import { LiveContent } from "@/components/learning/LiveContent";
export async function generateMetadata() {
  try {
    const data = await overview();
    return metadata(
      "A field guide to options",
      "Explore the curriculum, understand prerequisites and distinguish planned scopes from reviewed lessons.",
      "/",
      data.programs.some((p) => p.indexable),
    );
  } catch {
    return metadata(
      "Learning content unavailable",
      "The public learning catalog is temporarily unavailable.",
      "/",
      false,
    );
  }
}
export default async function Home() {
  const result = await overview().then(
    (data) => ({ data, error: null }),
    (error) => ({ data: null, error }),
  );
  if (!result.data) return <Unavailable error={result.error} />;
  const data = result.data;
  return (
    <LiveContent generation={data.generation} stamp={await renderStamp()}>
      <div className="home-hero">
        <section>
          <p className="eyebrow">Options / A field guide to learning</p>
          <h1>
            Understand the contract.
            <br />
            Then explore the possibilities.
          </h1>
          <p className="lead">
            Explore ideas in sequence, check the preparation you need, and
            distinguish a planned scope from a reviewed explanation.
          </p>
          <div className="actions">
            <PublicLink className="button primary" href="/curriculum">
              Explore the curriculum
            </PublicLink>
            <a href="#learning-method">How to use this guide</a>
          </div>
        </section>
        <aside className="hero-note">
          <p className="eyebrow">The current publication</p>
          <h2>{data.programs[0]?.title || "A map for your learning"}</h2>
          <p>
            {data.programs[0]?.summary ||
              "No program has been included in this publication."}
          </p>
          <p>
            {data.lessons === 0
              ? "The published catalog is a curriculum map. Reviewed topic lessons are not available yet."
              : "Reviewed lessons are labeled individually. Planned outlines describe scope, not completed instruction."}
          </p>
        </aside>
      </div>
      <dl className="count-strip">
        <div>
          <dt>Published phases</dt>
          <dd>{data.phases.length}</dd>
        </div>
        <div>
          <dt>Module designs</dt>
          <dd>{data.modules.length}</dd>
        </div>
        <div>
          <dt>Topic scopes</dt>
          <dd>{data.total}</dd>
        </div>
        <div>
          <dt>Reviewed topic lessons</dt>
          <dd>{data.lessons}</dd>
        </div>
      </dl>
      <section>
        <div className="section-heading">
          <h2>Find your place in the curriculum</h2>
          <PublicLink href="/curriculum">See the roadmap</PublicLink>
        </div>
        <CardGrid cards={data.phases.slice(0, 3)} />
      </section>
      <section id="learning-method" className="reading-width">
        <h2>Build understanding before measuring progress</h2>
        <ol className="method-list">
          <li>
            <h3>Read the scope</h3>
            <p>
              Use objectives and preparation notes to understand what a topic
              expects and what it intends to teach.
            </p>
          </li>
          <li>
            <h3>Work through reviewed material</h3>
            <p>
              A reviewed lesson includes authored explanation. An outline is a
              plan for instruction and is labeled accordingly.
            </p>
          </li>
          <li>
            <h3>Separate practice from mastery</h3>
            <p>
              Reading is not a scored assessment. Progress tracking, saved
              places and assessment workflows are not available in this release.
            </p>
          </li>
        </ol>
      </section>
    </LiveContent>
  );
}
