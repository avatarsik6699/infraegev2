#!/usr/bin/env node
// CI check (docs/SPEC.md §2.2/§3/§7.2, Content Quality Gate §2.3): every id referenced by
// prerequisites/related_topics/unlocks_topics/practice_task_ids/topic_ids and implemented course
// lesson membership must stay consistent. Fails the build on a broken link so it never reaches prod. Deliberately
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
const courseLessonMembershipCounts = new Map();
const courseLessonsById = new Map(
  courseLessonPublications.map((lesson) => [lesson.id, lesson]),
);

function checkRefs(file, ids, validSet, field) {
  for (const id of ids ?? []) {
    if (!validSet.has(id)) {
      errors.push(`${file}: ${field} references unknown id "${id}"`);
    }
  }
}

function checkLearningVisualAssets(file, expectedPrefix, blocks) {
  learningVisualAssets(blocks).forEach(({ asset, field }) =>
    checkLearningVisualAsset(file, expectedPrefix, field, asset),
  );
}

function learningVisualAssets(blocks) {
  return (blocks ?? [])
    .map((block, index) => ({ block, field: `learning_visual[${index}]` }))
    .filter(({ block }) => block.type === "learning_visual")
    .filter(({ block }) => block.data?.representation !== "structured")
    .map(({ block, field }) => ({ asset: block.data?.asset ?? {}, field }));
}

function checkLearningVisualAsset(file, expectedPrefix, field, asset) {
  if (!isValidLearningVisualSource(asset.src, expectedPrefix)) {
    errors.push(
      `${file}: ${field}.asset.src must be a PNG/WebP/AVIF under "${expectedPrefix}"`,
    );
    return;
  }
  checkPositiveDimension(file, field, "width", asset.width);
  checkPositiveDimension(file, field, "height", asset.height);
  checkLearningVisualAssetExists(file, field, asset.src);
}

function isValidLearningVisualSource(source, expectedPrefix) {
  return (
    typeof source === "string" &&
    source.startsWith(expectedPrefix) &&
    !source.includes("..") &&
    /\.(png|webp|avif)$/i.test(source)
  );
}

function checkPositiveDimension(file, field, dimension, value) {
  if (Number.isInteger(value) && value > 0) return;
  errors.push(
    `${file}: ${field}.asset.${dimension} must be a positive integer`,
  );
}

function checkLearningVisualAssetExists(file, field, source) {
  const assetPath = join(WEB_PUBLIC_ROOT, source.slice(1));
  if (existsSync(assetPath)) return;
  errors.push(`${file}: ${field}.asset.src does not exist: ${source}`);
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
  const planIds = new Set();
  for (const courseModule of course.modules) {
    if (moduleIds.has(courseModule.id)) {
      errors.push(
        `course "${course.id}": duplicate module id "${courseModule.id}"`,
      );
    }
    moduleIds.add(courseModule.id);
    for (const planItem of courseModule.lessonPlan ?? []) {
      if (planIds.has(planItem.id)) {
        errors.push(
          `course "${course.id}": duplicate lesson plan id "${planItem.id}"`,
        );
      }
      planIds.add(planItem.id);
      if (!planItem.title?.trim() || !planItem.outcome?.trim()) {
        errors.push(
          `course "${course.id}": lesson plan "${planItem.id}" needs title and outcome`,
        );
      }
      const lesson = courseLessonsById.get(planItem.id);
      if (!lesson) continue;
      courseLessonMembershipCounts.set(
        lesson.id,
        (courseLessonMembershipCounts.get(lesson.id) ?? 0) + 1,
      );
      if (lesson.title !== planItem.title) {
        errors.push(
          `course "${course.id}": lesson plan title for "${lesson.id}" must match the CourseLesson title`,
        );
      }
    }
  }
}

for (const lesson of courseLessonPublications) {
  if (courseLessonMembershipCounts.get(lesson.id) !== 1) {
    errors.push(
      `course lesson "${lesson.id}" must appear in exactly one course lesson plan`,
    );
  }
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
