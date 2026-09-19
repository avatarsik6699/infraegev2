import "./practice-catalog-topics.mjs";

// Release-owned material IDs and section anchors. Generated output is never authored separately.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { lessonPublications } from "../apps/web/src/shared/config/lesson-publication.mjs";
import {
  courseLessonPublications,
  coursePublications,
} from "../apps/web/src/entities/course/content/course-publication.mjs";

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
    const courses = coursePublications.filter((course) =>
      course.modules.some((module) =>
        module.lessonPlan.some((lesson) => lesson.id === publication.id),
      ),
    );
    if (kind === "course" && courses.length !== 1)
      throw new Error(`Ambiguous course membership: ${publication.id}`);
    materials.push({
      id: publication.id,
      sections,
      kind: kind === "lesson" ? "topic" : "course",
      status: publication.status,
      course_id: courses[0]?.id ?? null,
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
  JSON.stringify({ format: 1, materials, courses }, null, 2) + "\n";
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
