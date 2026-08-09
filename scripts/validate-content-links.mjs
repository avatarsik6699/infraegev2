#!/usr/bin/env node
// CI check (docs/SPEC.md §2.2/§3/§7.2, Content Quality Gate §2.3): every id referenced by
// prerequisites/related_topics/unlocks_topics/practice_task_ids/topic_ids must resolve to a real
// content file. Fails the build on a broken link so it never reaches prod. Deliberately
// dependency-free — this only checks id references, not full schema shape.

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_ROOT = join(REPO_ROOT, "content");

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

for (const { file, data } of topics) {
  checkRefs(file, data.prerequisites, topicOrLessonIds, "prerequisites");
  checkRefs(file, data.related_topics, topicIds, "related_topics");
  checkRefs(file, data.practice_task_ids, taskIds, "practice_task_ids");
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
  }
}

for (const { file, data } of tasks) {
  checkRefs(file, data.topic_ids, topicOrLessonIds, "topic_ids");
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
