import { examTopicDefinitions } from "~/shared/config/exam-topics.mjs";
import { lessonPublications } from "~/shared/config/lesson-publication.mjs";
import type { TopicCatalogTypes } from "./topic-catalog.types";

/**
 * Subtopics per published lesson, kept here so the prerendered home does not
 * load lesson content; `tests/topic-catalog.test.tsx` checks them against
 * the lesson definitions.
 */
const subtopicCounts: Readonly<Record<string, number>> = {
  rekursiya: 7,
  "relational-databases": 7,
  "coding-and-fano": 7,
  "preobrazovanie-zapisey-chisel": 6,
  "media-coding": 7,
  "word-enumeration": 7,
  networks: 7,
  "information-amount": 6,
  "numeral-systems": 7,
  spreadsheets: 8,
  "number-sequences": 8,
  "spreadsheet-optimization": 8,
  "winning-strategy": 7,
  "graph-analysis": 7,
  "string-processing": 8,
  "divisors-and-masks": 6,
  "array-processing": 8,
  "data-analysis": 8,
  "information-models": 6,
  "truth-tables": 6,
  "simple-algorithms": 7,
  executors: 7,
  "branching-and-enumeration": 8,
  "logic-transformations": 7,
  "parallel-computing": 8,
};

const publicationById = new Map(
  lessonPublications.map(
    (publication) => [publication.id, publication] as const,
  ),
);

const entries: readonly TopicCatalogTypes.Entry[] = examTopicDefinitions.map(
  (definition) => {
    const publication = publicationById.get(definition.id);
    if (publication?.status !== "published") {
      return { ...definition, status: "planned" };
    }

    return {
      ...definition,
      taskNumbers: publication.taskNumbers,
      title: publication.title,
      summary: publication.summary,
      status: "published",
      routeSlug: publication.routeSlug,
      subtopicCount: subtopicCounts[definition.id] ?? 0,
    };
  },
);

function formatTaskNumbers(taskNumbers: TopicCatalogTypes.TaskNumbers): string {
  if (taskNumbers.length === 1) {
    return `Задание ${String(taskNumbers[0])}`;
  }

  const consecutive = taskNumbers.every(
    (taskNumber, index) =>
      index === 0 || taskNumber === taskNumbers[index - 1] + 1,
  );

  return consecutive
    ? `Задания ${String(taskNumbers[0])}–${String(taskNumbers.at(-1))}`
    : `Задания ${taskNumbers.join(", ")}`;
}

export const topicCatalog = {
  entries,
  formatTaskNumbers,
} as const;
