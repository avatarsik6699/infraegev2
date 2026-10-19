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
    const field = (name) =>
      chunk.match(new RegExp(`^ {6}${name}: "([^"]+)",`, "m"))?.[1];
    const ids = chunk.match(/^ {6}conceptIds: \[([\s\S]*?)\]/m);
    const slug = field("slug");
    if (!slug || !ids) throw new Error(`Unsupported subtopic shape: ${id}`);
    return [
      {
        slug,
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
