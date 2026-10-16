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
    expect(examTopics.map((topic) => topic.exam_number)).toEqual(numbers);
    expect(examTopics.map((topic) => topic.id)).toEqual(
      numbers.map((number) => `ege-${number}`),
    );
    for (const topic of examTopicDefinitions) {
      for (const number of topic.taskNumbers) {
        expect(
          examTopics.find((option) => option.exam_number === number),
        ).toEqual({
          id: `ege-${number}`,
          label: `${number} номер. ${number === 16 ? "Рекурсия" : topic.title}`,
          group: "ЕГЭ",
          exam_number: number,
          material_ids: [],
        });
      }
    }
  });

  it.each([
    [10, "Компьютерные сети и адресация", "networks"],
    [12, "Машина Тьюринга", "executors"],
    [13, "Подсчёт программ исполнителя", "branching-and-enumeration"],
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
    ).toEqual([1, 2, 6, 12, 13, 15, 22]);
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
