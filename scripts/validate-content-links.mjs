#!/usr/bin/env node
// CI check (docs/SPEC.md §2.2/§3/§7.2, Content Quality Gate §2.3): lesson-plan membership,
// practice-task ownership and theory links must stay consistent. Fails the build on a broken link
// so it never reaches prod. Deliberately dependency-free — this checks references, not full schema shape.

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { lessonPublications } from "../apps/web/src/shared/config/lesson-publication.mjs";
import {
  courseLessonPublications,
  coursePublications,
} from "../apps/web/src/entities/course/content/course-publication.mjs";
import { validateTaskContentAssets } from "./lib/task-content-assets.mjs";

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

const tasks = readJsonFiles(join(CONTENT_ROOT, "tasks"));

const topicIds = new Set(lessonPublications.map((lesson) => lesson.id));
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
  for (const [field, blocks] of [
    ["statement", data.statement],
    ["hint", data.hint],
    ["explanation", data.explanation],
  ]) {
    errors.push(
      ...validateTaskContentAssets({
        file,
        taskId: data.id,
        field,
        blocks,
        publicRoot: WEB_PUBLIC_ROOT,
      }),
    );
  }
}

if (errors.length > 0) {
  console.error(
    "Content link validation failed:\n" +
      errors.map((e) => `  - ${e}`).join("\n"),
  );
  process.exit(1);
}

console.log(
  `Content link validation passed (${lessonPublications.length} Topic lessons, ${tasks.length} tasks, ${coursePublications.length} courses, ${courseLessonPublications.length} Course lessons).`,
);
