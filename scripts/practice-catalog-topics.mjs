// Publication-owned catalog taxonomy; independent of operator bank metadata.
import { readFileSync, writeFileSync } from "node:fs";
import { lessonPublications } from "../apps/web/src/shared/config/lesson-publication.mjs";
import {
  coursePublications,
  courseLessonPublications,
} from "../apps/web/src/entities/course/content/course-publication.mjs";
const topics = lessonPublications
  .filter((x) => x.status === "published")
  .flatMap((x) =>
    x.taskNumbers.map((number) => ({
      id: `ege-${number}`,
      label: `${number} номер. ${number === 16 ? "Рекурсия" : x.title}`,
      group: "ЕГЭ",
      exam_number: number,
      material_ids: [],
    })),
  )
  .sort((a, b) => a.exam_number - b.exam_number);
for (const course of coursePublications.filter(
  (x) => x.status === "published",
)) {
  for (const section of course.modules) {
    topics.push({
      id: `${course.id}-${section.id}`,
      label: `${course.id === "python" ? "Python" : course.title} · ${section.title}`,
      group: "Мини-курсы",
      exam_number: null,
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
const output = JSON.stringify(topics, null, 2) + "\n";
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
