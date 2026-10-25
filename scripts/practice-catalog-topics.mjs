// Canonical exam taxonomy; publication controls course membership only.
import { readFileSync, writeFileSync } from "node:fs";
import { format } from "prettier";
import { examTopicDefinitions } from "../apps/web/src/shared/config/exam-topics.mjs";
import {
  coursePublications,
  courseLessonPublications,
} from "../apps/web/src/entities/course/content/course-publication.mjs";
// Change 191 (F6): a topic covering several numbers (19–21) is one catalog option.
const topics = examTopicDefinitions
  .map((x) => {
    const first = x.taskNumbers[0];
    const last = x.taskNumbers[x.taskNumbers.length - 1];
    const range = first === last ? String(first) : `${first}–${last}`;
    return {
      id: first === last ? `ege-${first}` : `ege-${first}-${last}`,
      label: `${range} номер. ${x.title}`,
      group: "ЕГЭ",
      exam_number: first,
      exam_numbers: [...x.taskNumbers],
      material_ids: [],
    };
  })
  .sort((a, b) => a.exam_number - b.exam_number);
for (const course of coursePublications.filter(
  (x) => x.status === "published",
)) {
  for (const section of course.modules) {
    topics.push({
      id: `${course.id}-${section.id}`,
      label: `${course.shortTitle} · ${section.title}`,
      group: "Мини-курсы",
      exam_number: null,
      exam_numbers: [],
      material_ids: section.lessonPlan
        .filter((x) =>
          courseLessonPublications.some(
            (y) => y.id === x.id && y.status === "published",
          ),
        )
        .map((x) => x.id),
    });
  }
}
// Written Prettier-formatted, so a run never leaves the format gate red.
const output = await format(JSON.stringify(topics), { parser: "json" });
const target = new URL(
  "../apps/api/practice-catalog-topics.json",
  import.meta.url,
);
if (process.argv.includes("--check")) {
  if (
    JSON.stringify(JSON.parse(readFileSync(target, "utf8"))) !==
    JSON.stringify(topics)
  )
    throw new Error(
      "Catalog topics drift; run node scripts/practice-catalog-topics.mjs",
    );
} else writeFileSync(target, output);
