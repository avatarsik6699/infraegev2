// The site lesson sources are the only source of the lessons (Change 197). The release
// registry and the content validator read the structure they need straight from them.
import { readFileSync } from "node:fs";

const CONTENT = new URL("../../apps/web/src/entities/", import.meta.url);

/** The module text of a topic (`lesson`) or course (`course`) lesson. */
export function lessonSource(kind, id) {
  return readFileSync(
    new URL(`${kind}/content/${id}.lesson.tsx`, CONTENT),
    "utf8",
  );
}

/**
 * The subtopic fields holding one string literal at six spaces, on their line or the next one
 * (Prettier's wrap). Change 238: literal patterns, so no expression is built from a value.
 */
const TEXT_FIELDS = {
  title: /^ {6}title:\s*("(?:[^"\\]|\\.)*"),/m,
  lead: /^ {6}lead:\s*("(?:[^"\\]|\\.)*"),/m,
};

/** A subtopic's `title` or `lead`; `undefined` when the subtopic has none. */
function text(chunk, name) {
  const match = chunk.match(TEXT_FIELDS[name]);
  return match ? JSON.parse(match[1]) : undefined;
}

/** The exported name of the lesson module's definition (`export const x = define…(`). */
export function lessonExport(kind, id) {
  const name = lessonSource(kind, id).match(
    /^export const (\w+) = define(?:Course)?Lesson\(/m,
  )?.[1];
  if (!name) throw new Error(`Unsupported lesson export: ${kind} ${id}`);
  return name;
}

/** Plain top-level fields of a course lesson the overview and trees need. */
export function courseLessonFields(id) {
  const source = lessonSource("course", id);
  const threshold = source.match(/^ {2}masteryThreshold: ([0-9.]+),/m)?.[1];
  const selfCheck = source.match(/^ {4}selfCheck: (\d+),/m)?.[1];
  return {
    level: source.match(/^ {2}level: "(\w+)",/m)?.[1],
    masteryThreshold: threshold === undefined ? undefined : Number(threshold),
    selfCheck: selfCheck === undefined ? undefined : Number(selfCheck),
  };
}

const strings = (text) =>
  [...text.matchAll(/"([^"]*)"/g)].map((match) => match[1]);

/**
 * Subtopics of a topic lesson in order (slug, access, level, section ids) and the
 * access of its «Практика и итог». The authored shape is Prettier's: the subtopic
 * list at two spaces, each subtopic at four and its fields at six. A different
 * shape fails closed and requires updating this reader.
 */
export function topicStructure(id) {
  const source = lessonSource("lesson", id);
  const list = source.match(/\n {2}subtopics: \[\n([\s\S]*?)\n {2}\],\n/);
  if (!list) throw new Error(`Unsupported subtopic shape: ${id}`);
  const subtopics = list[1].split(/\n {4}\},?\n/).flatMap((chunk) => {
    if (!chunk.trim()) return [];
    // `name` is one of this script's own field literals.
    const field = (name) =>
      // nosemgrep: javascript.lang.security.audit.detect-non-literal-regexp.detect-non-literal-regexp
      chunk.match(new RegExp(`^ {6}${name}: "([^"]+)",`, "m"))?.[1];
    const ids = chunk.match(/^ {6}conceptIds: \[([\s\S]*?)\]/m);
    const slug = field("slug");
    const title = text(chunk, "title");
    if (!slug || !ids || !title)
      throw new Error(`Unsupported subtopic shape: ${id}`);
    return [
      {
        slug,
        title,
        lead: text(chunk, "lead"),
        access: field("access") ?? "free",
        level: field("level") ?? "core",
        sections: strings(ids[1]),
      },
    ];
  });
  return {
    subtopics,
    finalAccess: /^ {2}paidPractice: \{/m.test(source) ? "paid" : "free",
  };
}

/** The access tier of a course lesson; a lesson without one is free. */
export function courseLessonAccess(id) {
  return (
    lessonSource("course", id).match(/^ {2}accessTier: "(\w+)",/m)?.[1] ??
    "free"
  );
}
