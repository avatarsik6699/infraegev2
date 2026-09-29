#!/usr/bin/env node
// Validate authored course publication and the canonical current bank, never legacy task JSON.

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname, extname } from "node:path";
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

// Lesson media: every /lesson-media reference anywhere in the web sources exists (lessons live under
// entities/lesson and entities/course). A path without an
// extension is a video that needs both formats; unreferenced files are reported.
const MEDIA_ROOT = join(REPO_ROOT, "apps/web/public/lesson-media");
const WEB_SOURCE_DIR = join(REPO_ROOT, "apps/web/src");
const sourceFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(tsx?|mjs)$/u.test(entry.name) ? [path] : [];
  });
const MEDIA_SIZE_GUIDELINE_KB = 300;
const referencedMedia = new Set();
for (const path of sourceFiles(WEB_SOURCE_DIR)) {
  const file = path.slice(WEB_SOURCE_DIR.length + 1);
  const source = readFileSync(path, "utf8");
  for (const [, mediaPath] of source.matchAll(
    /["'`](\/lesson-media\/[^"'`\s]+)["'`]/gu,
  )) {
    const targets = extname(mediaPath)
      ? [mediaPath]
      : [`${mediaPath}.webm`, `${mediaPath}.mp4`];
    for (const target of targets) {
      referencedMedia.add(target);
      const absolute = join(REPO_ROOT, "apps/web/public", target);
      if (!existsSync(absolute)) {
        errors.push(`${file}: lesson media "${target}" does not exist`);
      } else if (
        /\.(webm|mp4)$/u.test(target) &&
        statSync(absolute).size > MEDIA_SIZE_GUIDELINE_KB * 1024
      ) {
        console.warn(
          `note: ${target} is above the ${MEDIA_SIZE_GUIDELINE_KB} KB guideline; quality and delivery come first`,
        );
      }
    }
  }
}
if (existsSync(MEDIA_ROOT)) {
  const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory()
        ? walk(join(dir, entry.name))
        : [join(dir, entry.name)],
    );
  for (const file of walk(MEDIA_ROOT)) {
    const publicPath = file.slice(join(REPO_ROOT, "apps/web/public").length);
    if (!referencedMedia.has(publicPath)) {
      errors.push(
        `lesson media "${publicPath}" is not referenced by any lesson`,
      );
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
