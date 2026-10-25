import "./practice-catalog-topics.mjs";

// Release-owned material IDs and section anchors. Generated output is never authored separately.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { lessonPublications } from "../apps/web/src/shared/config/lesson-publication.mjs";
import {
  courseLessonPublications,
  coursePublications,
} from "../apps/web/src/entities/course/content/course-publication.mjs";
import { format } from "prettier";
import {
  courseLessonAccess,
  courseLessonFields,
  lessonExport,
  lessonSource,
  topicStructure,
} from "./lib/lesson-sources.mjs";

// Change 192: access per subtopic, final page and course lesson; since Change 197 the
// site lesson modules are the only source of it and of the subtopic order.
const materials = [];
for (const [kind, publications] of [
  ["lesson", lessonPublications],
  ["course", courseLessonPublications],
]) {
  for (const publication of publications) {
    // T254: the sections of «Практика и итог» (from `finalLead` on, after the
    // theory) are not theory anchors: tasks never link to them.
    const source = lessonSource(kind, publication.id).split(
      /\n {2}finalLead:/,
    )[0];
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
    const topic =
      kind === "lesson" ? topicStructure(publication.id) : undefined;
    const subtopics = topic
      ? topic.subtopics.map(({ slug, access, sections }) => ({
          slug,
          access,
          sections,
        }))
      : [];
    const authored = topic
      ? subtopics.flatMap((subtopic) => subtopic.sections)
      : sections;
    if ([...authored].sort().join() !== [...sections].sort().join())
      throw new Error(
        `Subtopics and lesson sections differ: ${publication.id}`,
      );
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
        ? { subtopics, final_access: topic.finalAccess }
        : { access: courseLessonAccess(publication.id) }),
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
// Written Prettier-formatted, so a run never leaves the format gate red.
const output = await format(JSON.stringify({ format: 2, materials, courses }), {
  parser: "json",
});
const target = fileURLToPath(
  new URL("../apps/api/practice-registry.json", import.meta.url),
);
// Change 222: outlines of every topic and course lesson without their content, so trees,
// catalogs, /pricing and the sitemap never pull all lessons into one chunk; each entry
// loads its module on demand.
// An object literal of the plain fields plus the module's loader.
const entry = (fields, id, name) =>
  `${JSON.stringify(fields).slice(0, -1)}, load: () => import("./${id}.lesson").then((module) => module.${name}) }`;
const topicOutlines = lessonPublications.map((publication) => {
  const topic = topicStructure(publication.id);
  const subtopics = topic.subtopics.map((subtopic) => ({
    slug: subtopic.slug,
    title: subtopic.title,
    ...(subtopic.lead ? { lead: subtopic.lead } : {}),
    level: subtopic.level,
    paid: subtopic.access === "paid",
    sections: subtopic.sections,
  }));
  const paidPractice = topic.finalAccess === "paid";
  const fields = {
    id: publication.id,
    routeSlug: publication.routeSlug,
    title: publication.title,
    summary: publication.summary,
    taskNumbers: publication.taskNumbers,
    status: publication.status,
    accessTier:
      paidPractice || subtopics.some((subtopic) => subtopic.paid)
        ? "paid"
        : "free",
    paidPractice,
    subtopics,
  };
  return entry(fields, publication.id, lessonExport("lesson", publication.id));
});
const courseOutlines = courseLessonPublications.map((publication) => {
  const accessTier = courseLessonAccess(publication.id);
  const extra = courseLessonFields(publication.id);
  const fields = {
    id: publication.id,
    routeSlug: publication.routeSlug,
    title: publication.title,
    summary: publication.summary,
    status: publication.status,
    accessTier,
    ...(accessTier === "paid"
      ? { paid: { selfCheck: extra.selfCheck ?? 0 } }
      : {}),
    ...(extra.level ? { level: extra.level } : {}),
    ...(extra.masteryThreshold === undefined
      ? {}
      : { masteryThreshold: extra.masteryThreshold }),
  };
  return entry(fields, publication.id, lessonExport("course", publication.id));
});
const header =
  "// Generated by scripts/practice-registry.mjs from the lesson modules (Change 222); do not edit.\n";
const outlineFiles = [
  [
    "../apps/web/src/entities/lesson/content/topic-outlines.gen.ts",
    `${header}import type { LessonContent } from "../lib/define-lesson.types";\n\nexport const topicOutlines: readonly LessonContent.Outline[] = [${topicOutlines.join(",")}];\n`,
  ],
  [
    "../apps/web/src/entities/course/content/course-lesson-outlines.gen.ts",
    `${header}import type { CourseTypes } from "../course.types";\n\nexport const courseLessonOutlines: readonly CourseTypes.LessonOutline[] = [${courseOutlines.join(",")}];\n`,
  ],
];
const outlines = await Promise.all(
  outlineFiles.map(async ([path, source]) => [
    fileURLToPath(new URL(path, import.meta.url)),
    await format(source, { parser: "typescript" }),
  ]),
);

if (process.argv.includes("--check")) {
  if (
    JSON.stringify(JSON.parse(readFileSync(target, "utf8"))) !==
    JSON.stringify(JSON.parse(output))
  )
    throw new Error(
      "Practice registry drift; run node scripts/practice-registry.mjs",
    );
  for (const [path, source] of outlines) {
    if (readFileSync(path, "utf8") !== source)
      throw new Error(
        `Lesson outline drift (${path}); run node scripts/practice-registry.mjs`,
      );
  }
} else {
  writeFileSync(target, output);
  for (const [path, source] of outlines) writeFileSync(path, source);
}
