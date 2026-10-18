import "./practice-catalog-topics.mjs";

// Release-owned material IDs and section anchors. Generated output is never authored separately.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { lessonPublications } from "../apps/web/src/shared/config/lesson-publication.mjs";
import {
  courseLessonPublications,
  coursePublications,
} from "../apps/web/src/entities/course/content/course-publication.mjs";

// Change 192: access per subtopic, final page and course lesson comes from the
// approved stand, which also fixes the authored order of the topic sections.
const stand = new URL("../content/lesson-design/", import.meta.url);
const standJson = (path) =>
  JSON.parse(readFileSync(new URL(path, stand), "utf8"));
const topics = new Map(
  readdirSync(stand)
    .filter((name) => /^topic-\d+$/.test(name))
    .map((name) => standJson(`${name}/topic.json`))
    .filter((topic) => topic.site)
    .map((topic) => [topic.site.id, topic]),
);
const courseAccess = new Map(
  readdirSync(stand)
    .filter((name) => name.startsWith("course-"))
    .flatMap((name) =>
      standJson(`${name}/course.json`).modules.flatMap((module) =>
        module.lessons.map((lesson) => [
          lesson.site.id,
          lesson.access ?? "free",
        ]),
      ),
    ),
);
const TASK_BLOCK = /^\*\*(Чтобы проверить понимание|Задачи основных подтем)/;

/** The subtopics of a stand topic with their sections, as the export names them. */
function standSubtopics(topic) {
  const folder = new URL(`topic-${topic.number}/`, stand);
  return topic.subtopics.map((subtopic) => {
    const slug = subtopic.source.replace(/\.md$/, "").replace(/^\d+-/, "");
    const steps = readFileSync(new URL(subtopic.source, folder), "utf8")
      .split(/\n---\n/)
      .map((step) => step.trim())
      .filter((step) => step && !TASK_BLOCK.test(step));
    const anchors = topic.site.steps?.[subtopic.source] ?? [];
    return {
      slug,
      access: subtopic.access ?? "free",
      sections: steps.map(
        (_, index) => anchors[index]?.[0] ?? `${slug}-${String(index + 1)}`,
      ),
    };
  });
}

const materials = [];
for (const [kind, publications] of [
  ["lesson", lessonPublications],
  ["course", courseLessonPublications],
]) {
  for (const publication of publications) {
    const source = readFileSync(
      new URL(
        `../apps/web/src/entities/${kind}/content/${publication.id}.lesson.tsx`,
        import.meta.url,
      ),
      "utf8",
    );
    // Current authored shape is literal id immediately before literal navLabel. A shape change
    // fails closed and requires updating this extractor; checkpoints are not section anchors.
    const sections = [
      ...source.matchAll(/\bid:\s*"([a-z0-9-]+)",\s*navLabel:\s*"/g),
    ].map((match) => match[1]);
    if (
      !sections.length ||
      sections.length !== [...source.matchAll(/\bnavLabel\s*:/g)].length
    ) {
      throw new Error(`Unsupported concept shape: ${publication.id}`);
    }
    const topic = kind === "lesson" ? topics.get(publication.id) : undefined;
    if (kind === "lesson" && !topic)
      throw new Error(`No stand topic for ${publication.id}`);
    const subtopics = topic ? standSubtopics(topic) : [];
    const authored = topic
      ? subtopics.flatMap((subtopic) => subtopic.sections)
      : sections;
    if ([...authored].sort().join() !== [...sections].sort().join())
      throw new Error(`Stand and lesson sections differ: ${publication.id}`);
    const courses = coursePublications.filter((course) =>
      course.modules.some((module) =>
        module.lessonPlan.some((lesson) => lesson.id === publication.id),
      ),
    );
    if (kind === "course" && courses.length !== 1)
      throw new Error(`Ambiguous course membership: ${publication.id}`);
    materials.push({
      id: publication.id,
      sections: authored,
      kind: kind === "lesson" ? "topic" : "course",
      status: publication.status,
      course_id: courses[0]?.id ?? null,
      ...(topic
        ? { subtopics, final_access: topic.final.access ?? "free" }
        : { access: courseAccess.get(publication.id) ?? "free" }),
    });
  }
}
materials.sort((a, b) => a.id.localeCompare(b.id, "en"));
const courses = coursePublications.map((course) => ({
  id: course.id,
  status: course.status,
  lesson_ids: course.modules.flatMap((module) =>
    module.lessonPlan.map((lesson) => lesson.id),
  ),
}));
const output =
  JSON.stringify({ format: 2, materials, courses }, null, 2) + "\n";
const target = fileURLToPath(
  new URL("../apps/api/practice-registry.json", import.meta.url),
);
if (process.argv.includes("--check")) {
  if (
    JSON.stringify(JSON.parse(readFileSync(target, "utf8"))) !==
    JSON.stringify(JSON.parse(output))
  )
    throw new Error(
      "Practice registry drift; run node scripts/practice-registry.mjs",
    );
} else {
  writeFileSync(target, output);
}
