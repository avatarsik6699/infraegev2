#!/usr/bin/env node
// Validate authored course publication and the canonical current bank, never legacy task JSON.

import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { lessonPublications } from "../apps/web/src/shared/config/lesson-publication.mjs";
import {
  courseLessonPublications,
  coursePublications,
} from "../apps/web/src/entities/course/content/course-publication.mjs";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
execFileSync(
  process.execPath,
  [join(REPO_ROOT, "scripts/practice-registry.mjs"), "--check"],
  { stdio: "inherit" },
);
execFileSync(
  "uv",
  [
    "run",
    "--frozen",
    "python",
    "-m",
    "app.modules.practice.cli",
    "validate",
    join(REPO_ROOT, "content/practice-bank"),
  ],
  { cwd: join(REPO_ROOT, "apps/api"), stdio: "inherit" },
);

const errors = [];
const courseLessonMembershipCounts = new Map();
const courseLessonsById = new Map(
  courseLessonPublications.map((lesson) => [lesson.id, lesson]),
);

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
}

if (errors.length > 0) {
  console.error(
    "Content link validation failed:\n" +
      errors.map((e) => `  - ${e}`).join("\n"),
  );
  process.exit(1);
}

console.log(
  `Content link validation passed (${lessonPublications.length} Topic lessons, ${coursePublications.length} courses, ${courseLessonPublications.length} Course lessons).`,
);
