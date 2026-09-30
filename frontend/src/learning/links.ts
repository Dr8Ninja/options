import type { components } from "@/api/schema";
export type Schema = components["schemas"];
export type Card = Schema["Card"];
export const readingKinds = [
  "programs",
  "phases",
  "modules",
  "topics",
  "subtopics",
] as const;
export type ReadingKind = (typeof readingKinds)[number];
export function readingPath(value: string): string | null {
  return /^\/(programs|phases|modules|topics|subtopics|resources|paths|projects|capstones|exercises|quizzes)\/[A-Za-z0-9][A-Za-z0-9._:-]{0,159}$/.test(
    value,
  )
    ? value
    : null;
}
export function referencePath(ref: Schema["Reference"]) {
  if (!["MAP", "LESSON"].includes(ref.availability)) return null;
  const kind = ref.kind === "QUIZ" ? "quizzes" : ref.kind.toLowerCase() + "s";
  return readingPath(`/${kind}/${ref.id}`);
}
export function safeLink(value: string): string | null {
  if (
    value === "/" ||
    ["/curriculum", "/resources", "/paths", "/projects", "/search"].includes(
      value,
    ) ||
    /^#[a-zA-Z0-9._:-]+$/.test(value)
  )
    return value;
  if (readingPath(value)) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}
export function indexable(card: Card) {
  return (
    card.indexable === true &&
    (!["TOPIC", "SUBTOPIC"].includes(card.kind) ||
      (card.visibility === "LESSON" && card.readiness === "reviewed_lesson"))
  );
}
export function summary(text: string) {
  return text
    .replace(/[#*_`<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}
