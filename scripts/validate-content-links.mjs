#!/usr/bin/env node
// CI check (docs/SPEC.md §2.2/§3/§7.2, Content Quality Gate §2.3): every id referenced by
// prerequisites/related_topics/unlocks_topics/practice_task_ids/topic_ids must resolve to a real
// content file. Fails the build on a broken link so it never reaches prod. Deliberately
// dependency-free — this only checks id references, not full schema shape.

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { lessonPublications } from "../apps/web/src/entities/lesson/content/lesson-publication.mjs";
import {
  courseLessonPublications,
  coursePublications,
} from "../apps/web/src/entities/course/content/course-publication.mjs";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_ROOT = join(REPO_ROOT, "content");
const WEB_PUBLIC_ROOT = join(REPO_ROOT, "apps", "web", "public");

function readJsonFiles(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({
      file: join(dir, f),
      data: JSON.parse(readFileSync(join(dir, f), "utf-8")),
    }));
}

const topics = readJsonFiles(join(CONTENT_ROOT, "topics"));
const tasks = readJsonFiles(join(CONTENT_ROOT, "tasks"));

const topicIds = new Set([
  ...topics.map((topic) => topic.data.id),
  ...lessonPublications.map((lesson) => lesson.id),
]);
const taskIds = new Set(tasks.map((t) => t.data.id));
const courseLessonIds = new Set(
  courseLessonPublications.map((lesson) => lesson.id),
);

const errors = [];

function checkRefs(file, ids, validSet, field) {
  for (const id of ids ?? []) {
    if (!validSet.has(id)) {
      errors.push(`${file}: ${field} references unknown id "${id}"`);
    }
  }
}

function checkLearningVisualAssets(file, expectedPrefix, blocks) {
  for (const [index, block] of (blocks ?? []).entries()) {
    if (block.type !== "learning_visual") continue;
    const data = block.data ?? {};
    if (data.representation === "structured") continue;
    const field = `learning_visual[${index}]`;
    const asset = data.asset ?? {};
    if (
      typeof asset.src !== "string" ||
      !asset.src.startsWith(expectedPrefix) ||
      asset.src.includes("..") ||
      !/\.(png|webp|avif)$/i.test(asset.src)
    ) {
      errors.push(
        `${file}: ${field}.asset.src must be a PNG/WebP/AVIF under "${expectedPrefix}"`,
      );
      continue;
    }
    if (!Number.isInteger(asset.width) || asset.width <= 0) {
      errors.push(`${file}: ${field}.asset.width must be a positive integer`);
    }
    if (!Number.isInteger(asset.height) || asset.height <= 0) {
      errors.push(`${file}: ${field}.asset.height must be a positive integer`);
    }

    const assetPath = join(WEB_PUBLIC_ROOT, asset.src.slice(1));
    if (!existsSync(assetPath)) {
      errors.push(`${file}: ${field}.asset.src does not exist: ${asset.src}`);
    }
  }
}

function contentBlocksFor(data) {
  return [
    ...(data.quick_reference_blocks ?? []),
    ...(data.sections ?? []).flatMap((section) => section.blocks ?? []),
  ];
}

for (const { file, data } of topics) {
  checkRefs(file, data.prerequisites, topicIds, "prerequisites");
  checkRefs(file, data.related_topics, topicIds, "related_topics");
  checkRefs(file, data.practice_task_ids, taskIds, "practice_task_ids");
  checkLearningVisualAssets(
    file,
    `/content/topics/${data.id}/`,
    contentBlocksFor(data),
  );
}

for (const course of coursePublications) {
  const moduleIds = new Set();
  for (const courseModule of course.modules) {
    if (moduleIds.has(courseModule.id)) {
      errors.push(
        `course "${course.id}": duplicate module id "${courseModule.id}"`,
      );
    }
    moduleIds.add(courseModule.id);
    checkRefs(
      `course "${course.id}"`,
      courseModule.lessonIds,
      courseLessonIds,
      `module "${courseModule.id}".lessonIds`,
    );
  }
}

for (const lesson of courseLessonPublications) {
  checkRefs(
    `course lesson "${lesson.id}"`,
    lesson.practiceTaskIds,
    taskIds,
    "practiceTaskIds",
  );
}

for (const { file, data } of tasks) {
  const topicOwners = data.topic_ids ?? [];
  const courseLessonOwners = data.course_lesson_ids ?? [];
  checkRefs(file, topicOwners, topicIds, "topic_ids");
  checkRefs(file, courseLessonOwners, courseLessonIds, "course_lesson_ids");
  if (topicOwners.length === 0 && courseLessonOwners.length === 0) {
    errors.push(`${file}: task must have a topic or course lesson owner`);
  }
  if (topicOwners.length > 0 && courseLessonOwners.length > 0) {
    errors.push(
      `${file}: task cannot bridge topic and course lesson ownership`,
    );
  }
  checkLearningVisualAssets(
    file,
    topicOwners.length > 0
      ? `/content/topics/${topicOwners[0]}/`
      : `/content/lessons/${courseLessonOwners[0] ?? "unknown"}/`,
    data.explanation,
  );
}

if (errors.length > 0) {
  console.error(
    "Content link validation failed:\n" +
      errors.map((e) => `  - ${e}`).join("\n"),
  );
  process.exit(1);
}

console.log(
  `Content link validation passed (${topics.length} JSON topics, ${lessonPublications.length} Topic lessons, ${tasks.length} tasks, ${coursePublications.length} courses, ${courseLessonPublications.length} Course lessons).`,
);
