import { describe, expect, it } from "vitest";
import { topicCatalog } from "~/entities/topic-catalog";
import { examTopicDefinitions } from "~/shared/config/exam-topics.mjs";
import { lessonPublications } from "~/shared/config/lesson-publication.mjs";
import {
  coursePublications,
  courseLessonPublications,
} from "~/entities/course/content/course-publication.mjs";
import practiceTopics from "../../api/practice-catalog-topics.json";

describe("canonical EGE 2027 taxonomy", () => {
  it("covers each number 1–27 exactly once independently of lesson publication", () => {
    const numbers = Array.from({ length: 27 }, (_, index) => index + 1);
    expect(examTopicDefinitions.flatMap((topic) => topic.taskNumbers)).toEqual(
      numbers,
    );
    expect(topicCatalog.entries.map((topic) => topic.id)).toEqual(
      examTopicDefinitions.map((topic) => topic.id),
    );
    const examTopics = practiceTopics.filter((topic) => topic.group === "ЕГЭ");
    // Change 191 (F6): one catalog option per topic; 19–21 is a single option.
    expect(examTopics.flatMap((topic) => topic.exam_numbers)).toEqual(numbers);
    expect(examTopics).toEqual(
      examTopicDefinitions.map((topic) => {
        const first = topic.taskNumbers[0];
        const last = topic.taskNumbers[topic.taskNumbers.length - 1];
        const range = first === last ? `${first}` : `${first}–${last}`;
        return {
          id: first === last ? `ege-${first}` : `ege-${first}-${last}`,
          label: `${range} номер. ${topic.title}`,
          group: "ЕГЭ",
          exam_number: first,
          exam_numbers: [...topic.taskNumbers],
          material_ids: [],
        };
      }),
    );
    expect(
      examTopics.find((topic) => (topic.exam_numbers as number[]).includes(20))
        ?.id,
    ).toBe("ege-19-21");
  });

  it.each([
    [10, "Маска подсети", "networks"],
    [12, "Исполнение алгоритма для исполнителя", "executors"],
    [13, "Анализ хода исполнения алгоритма", "branching-and-enumeration"],
    [23, "Анализ графов", "graph-analysis"],
  ] as const)(
    "uses the 2027 meaning for number %s without changing its stable topic ID",
    (number, title, id) => {
      expect(
        examTopicDefinitions.find((topic) =>
          topic.taskNumbers.includes(number),
        ),
      ).toMatchObject({ id, title });
    },
  );

  it("preserves publication title, summary, routes and numbers in lesson cards", () => {
    for (const publication of lessonPublications) {
      expect(
        topicCatalog.entries.find((topic) => topic.id === publication.id),
      ).toMatchObject({
        id: publication.id,
        title: publication.title,
        summary: publication.summary,
        taskNumbers: publication.taskNumbers,
        routeSlug: publication.routeSlug,
        status: publication.status,
      });
    }
    expect(
      topicCatalog.entries
        .filter((topic) => topic.status === "planned")
        .flatMap((topic) => topic.taskNumbers),
    ).toEqual([]);
  });

  it("preserves mini-course options and their published lesson membership", () => {
    const expected = coursePublications
      .filter((course) => course.status === "published")
      .flatMap((course) =>
        course.modules.map((section) => ({
          id: `${course.id}-${section.id}`,
          label: `${course.shortTitle} · ${section.title}`,
          group: "Мини-курсы",
          exam_number: null,
          exam_numbers: [],
          material_ids: section.lessonPlan
            .filter((lesson) =>
              courseLessonPublications.some(
                (publication) =>
                  publication.id === lesson.id &&
                  publication.status === "published",
              ),
            )
            .map((lesson) => lesson.id),
        })),
      );
    expect(
      practiceTopics.filter((topic) => topic.group === "Мини-курсы"),
    ).toEqual(expected);
  });
});
