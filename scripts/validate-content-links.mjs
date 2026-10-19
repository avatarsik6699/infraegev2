#!/usr/bin/env node
// Validate authored course publication and the canonical current bank, never legacy task JSON.

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { lessonPublications } from "../apps/web/src/shared/config/lesson-publication.mjs";
import {
  courseLessonPublications,
  coursePublications,
} from "../apps/web/src/entities/course/content/course-publication.mjs";
import { topicStructure } from "./lib/lesson-sources.mjs";

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

// Raster lesson media and their /lesson-media route were removed with the old recursion lesson
// (Change 184): lesson figures are code-built SVG in the lesson manifests.
const WEB_SOURCE_DIR = join(REPO_ROOT, "apps/web/src");
const sourceFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(tsx?|mjs)$/u.test(entry.name) ? [path] : [];
  });
for (const path of sourceFiles(WEB_SOURCE_DIR)) {
  if (/["'`]\/lesson-media\//u.test(readFileSync(path, "utf8"))) {
    errors.push(
      `${path.slice(WEB_SOURCE_DIR.length + 1)}: /lesson-media is no longer served`,
    );
  }
}

// Change 192: the approved free/paid matrix (SPEC §2.2). Free topics: tasks 1–11, 14
// and 16; elsewhere a prefix of about a third of the subtopics is free, advanced
// subtopics and «Практика и итог» are paid. Python is free; Excel lessons 1–6 are free.
const registry = JSON.parse(
  readFileSync(join(REPO_ROOT, "apps/api/practice-registry.json"), "utf8"),
);
const FREE_TASKS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 16]);
const FREE_COURSE_LESSONS = { python: Infinity, excel: 6 };
for (const material of registry.materials) {
  if (material.kind === "topic") {
    const publication = lessonPublications.find(
      (item) => item.id === material.id,
    );
    const free = publication?.taskNumbers.every((n) => FREE_TASKS.has(n));
    const access = material.subtopics.map((subtopic) => subtopic.access);
    const freeCount = free ? access.length : Math.round(access.length / 3);
    const expected = access.map((_, index) =>
      index < freeCount ? "free" : "paid",
    );
    if (access.join() !== expected.join()) {
      errors.push(
        `topic "${material.id}": subtopic access ${access.join(",")} must be ${expected.join(",")}`,
      );
    }
    if (material.final_access !== (free ? "free" : "paid")) {
      errors.push(`topic "${material.id}": «Практика и итог» access`);
    }
    const levels = topicStructure(material.id).subtopics.map(
      (subtopic) => subtopic.level,
    );
    levels.forEach((level, index) => {
      if (level === "advanced" && access[index] === "free" && !free) {
        errors.push(`topic "${material.id}": an advanced subtopic is free`);
      }
    });
  } else if (material.course_id) {
    const course = registry.courses.find(
      (item) => item.id === material.course_id,
    );
    const index = course?.lesson_ids.indexOf(material.id) ?? -1;
    const limit = FREE_COURSE_LESSONS[material.course_id] ?? 0;
    const expected = index >= 0 && index < limit ? "free" : "paid";
    if (material.access !== expected) {
      errors.push(`course lesson "${material.id}": access must be ${expected}`);
    }
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
