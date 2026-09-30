import { overview, program, ensureGeneration } from "@/learning/catalog";
import { metadata, renderStamp } from "@/learning/seo";
import {
  Unavailable,
  PublicLink,
  Breadcrumbs,
} from "@/components/learning/Content";
import { LiveContent } from "@/components/learning/LiveContent";
import { referencePath } from "@/learning/links";
export async function generateMetadata() {
  try {
    const d = await overview();
    return metadata(
      "Curriculum roadmap",
      "Explore published phases, module designs and their preparation in sequence.",
      "/curriculum",
      d.programs.some((p) => p.indexable),
    );
  } catch {
    return metadata(
      "Curriculum unavailable",
      "The public roadmap is temporarily unavailable.",
      "/curriculum",
      false,
    );
  }
}
async function loadCurriculum() {
  const data = await overview();
  const programs = await Promise.all(data.programs.map((p) => program(p.id)));
  if (programs.some((p) => p.contentVersion.generation !== data.generation))
    throw new Error("Publication changed");
  await ensureGeneration(data.generation);
  return { data, programs };
}
export default async function Curriculum() {
  const result = await loadCurriculum().then(
    (data) => ({ data, error: null }),
    (error) => ({ data: null, error }),
  );
  if (!result.data) return <Unavailable error={result.error} />;
  const { data, programs } = result.data;
  return (
    <LiveContent generation={data.generation} stamp={await renderStamp()}>
      <Breadcrumbs
        items={[
          { title: "Home", href: "/" },
          { title: "Curriculum", href: "/curriculum" },
        ]}
      />
      <header className="page-heading">
        <p className="eyebrow">A sequence, not a checklist</p>
        <h1>Curriculum roadmap</h1>
        <p className="lead">
          {data.phases.length} published phases · {data.modules.length} module
          designs · {data.total} topic scopes · {data.lessons} reviewed topic
          lessons
        </p>
        <p>
          A published map explains the intended scope. Only pages labeled
          “Reviewed lesson” contain reviewed instruction.
        </p>
      </header>
      {programs.length ? (
        programs.map((p) => (
          <section key={p.id}>
            <h2>{p.title}</h2>
            <p className="reading-width">{p.qualification}</p>
            <ol className="roadmap">
              {p.phases.map((ref, i) => (
                <li key={ref.id}>
                  <span className="step" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="eyebrow">{ref.id}</p>
                    <h3>
                      {referencePath(ref) ? (
                        <PublicLink href={referencePath(ref)!}>
                          {ref.title}
                        </PublicLink>
                      ) : (
                        ref.title
                      )}
                    </h3>
                    <p>
                      {data.phases.find((x) => x.id === ref.id)?.summary ||
                        "This phase is not currently available."}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))
      ) : (
        <p className="notice">
          This publication does not contain a curriculum program.
        </p>
      )}
    </LiveContent>
  );
}
