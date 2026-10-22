import { examTopicDefinitions } from "~/shared/config/exam-topics.mjs";
import { lessonPublications } from "~/shared/config/lesson-publication.mjs";
import type { TopicCatalogTypes } from "./topic-catalog.types";

/**
 * Subtopics per published lesson and the first one's slug, kept here so the
 * prerendered home does not load lesson content; `tests/topic-catalog.test.tsx`
 * checks them against the lesson definitions. Links open the first subtopic
 * directly instead of the topic address that redirects to it (Change 194).
 */
const subtopicFacts: Readonly<
  Record<string, { count: number; first: string }>
> = {
  rekursiya: { count: 6, first: "funktsiya-cherez-sebya" },
  "relational-databases": { count: 4, first: "tablicy-i-klyuchi" },
  "coding-and-fano": { count: 4, first: "kod-i-uslovie-fano" },
  "preobrazovanie-zapisey-chisel": { count: 5, first: "chislo-i-zapis" },
  "media-coding": { count: 5, first: "bity-i-kody" },
  "word-enumeration": { count: 6, first: "slova-i-umnozhenie" },
  networks: { count: 6, first: "adres-i-maska" },
  "information-amount": { count: 6, first: "parol-v-bajtah" },
  "numeral-systems": { count: 6, first: "zapis-i-znachenie" },
  spreadsheets: { count: 6, first: "stroka-i-uslovie" },
  "number-sequences": { count: 7, first: "chisla-i-proverki" },
  "spreadsheet-optimization": { count: 6, first: "luchshaya-summa-do-kletki" },
  "winning-strategy": { count: 7, first: "igra-i-strategiya" },
  "graph-analysis": { count: 7, first: "graf-i-put" },
  "string-processing": { count: 8, first: "stroka-i-fragment" },
  "divisors-and-masks": { count: 6, first: "perebor-i-proverki" },
  "array-processing": { count: 8, first: "zapisi-i-rejting" },
  "data-analysis": { count: 8, first: "tochki-i-rasstoyaniya" },
  "information-models": { count: 6, first: "model-i-stepeni" },
  "truth-tables": { count: 4, first: "logicheskie-operacii" },
  "simple-algorithms": { count: 6, first: "sostoyanie-i-komandy" },
  executors: { count: 6, first: "lenta-i-komanda" },
  "branching-and-enumeration": { count: 7, first: "komandy-i-derevo" },
  "logic-transformations": { count: 6, first: "formula-i-parametr" },
  "parallel-computing": { count: 8, first: "process-i-zavisimost" },
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
      subtopicCount: subtopicFacts[definition.id]?.count ?? 0,
      firstSubtopic: subtopicFacts[definition.id]?.first ?? "",
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

/** The first subtopic of a published topic, by its route slug. */
function firstSubtopic(routeSlug: string): string | undefined {
  const entry = entries.find(
    (item) => item.status === "published" && item.routeSlug === routeSlug,
  );
  return entry?.status === "published" ? entry.firstSubtopic : undefined;
}

export const topicCatalog = {
  entries,
  formatTaskNumbers,
  firstSubtopic,
} as const;
