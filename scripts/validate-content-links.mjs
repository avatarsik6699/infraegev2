#!/usr/bin/env node
// CI check (docs/SPEC.md §2.2/§3/§7.2, Content Quality Gate §2.3): every id referenced by
// prerequisites/related_topics/unlocks_topics/practice_task_ids/topic_ids must resolve to a real
// content file. Fails the build on a broken link so it never reaches prod. Deliberately
// dependency-free — this only checks id references, not full schema shape.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_ROOT = join(REPO_ROOT, "content");
const WEB_PUBLIC_ROOT = join(REPO_ROOT, "apps", "web", "public");
const MAX_FIGURE_BYTES = 500 * 1024;

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
const courses = readJsonFiles(join(CONTENT_ROOT, "courses"));

const topicIds = new Set(topics.map((t) => t.data.id));
const taskIds = new Set(tasks.map((t) => t.data.id));
const lessonIds = new Set(
  courses.flatMap((c) => c.data.lessons.map((l) => l.id)),
);
const topicOrLessonIds = new Set([...topicIds, ...lessonIds]);

const errors = [];

function checkRefs(file, ids, validSet, field) {
  for (const id of ids ?? []) {
    if (!validSet.has(id)) {
      errors.push(`${file}: ${field} references unknown id "${id}"`);
    }
  }
}

function checkFigureBlocks(file, expectedPrefix, blocks) {
  for (const [index, block] of (blocks ?? []).entries()) {
    if (block.type !== "figure") continue;
    const data = block.data ?? {};
    const field = `figure[${index}]`;
    if (
      typeof data.src !== "string" ||
      !data.src.startsWith(expectedPrefix) ||
      data.src.includes("..") ||
      !/\.(png|webp)$/i.test(data.src)
    ) {
      errors.push(
        `${file}: ${field}.src must be a PNG/WebP under "${expectedPrefix}"`,
      );
      continue;
    }
    if (typeof data.alt !== "string" || data.alt.trim().length === 0) {
      errors.push(`${file}: ${field}.alt must be non-empty`);
    }
    if (!Number.isInteger(data.width) || data.width <= 0) {
      errors.push(`${file}: ${field}.width must be a positive integer`);
    }
    if (!Number.isInteger(data.height) || data.height <= 0) {
      errors.push(`${file}: ${field}.height must be a positive integer`);
    }

    const assetPath = join(WEB_PUBLIC_ROOT, data.src.slice(1));
    if (!existsSync(assetPath)) {
      errors.push(`${file}: ${field}.src asset does not exist: ${data.src}`);
    } else if (statSync(assetPath).size > MAX_FIGURE_BYTES) {
      errors.push(`${file}: ${field}.src exceeds 500 KiB: ${data.src}`);
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
  checkRefs(file, data.prerequisites, topicOrLessonIds, "prerequisites");
  checkRefs(file, data.related_topics, topicIds, "related_topics");
  checkRefs(file, data.practice_task_ids, taskIds, "practice_task_ids");
  checkFigureBlocks(
    file,
    `/content/topics/${data.id}/`,
    contentBlocksFor(data),
  );
}

for (const { file, data } of courses) {
  for (const lesson of data.lessons) {
    checkRefs(
      file,
      lesson.unlocks_topics,
      topicIds,
      `lesson "${lesson.id}".unlocks_topics`,
    );
    checkRefs(
      file,
      lesson.practice_task_ids,
      taskIds,
      `lesson "${lesson.id}".practice_task_ids`,
    );
    checkFigureBlocks(
      file,
      `/content/lessons/${lesson.id}/`,
      contentBlocksFor(lesson),
    );
  }
}

for (const { file, data } of tasks) {
  checkRefs(file, data.topic_ids, topicOrLessonIds, "topic_ids");
  checkFigureBlocks(
    file,
    `/content/topics/${data.topic_ids?.[0] ?? "unknown"}/`,
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
  `Content link validation passed (${topics.length} topics, ${tasks.length} tasks, ${courses.length} courses).`,
);
