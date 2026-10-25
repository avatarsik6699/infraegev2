import { describe, expect, it } from "vitest";
import { courseLessonOutlines } from "~/entities/course/content/course-lesson-outlines.gen";
import { lessonSubtopics, topicOutlines } from "~/entities/lesson";

// Change 222: the outlines are generated from the lesson sources by text; the modules
// themselves are the truth, so every generated field must match the loaded definition.
describe("generated lesson outlines", () => {
  it("match every topic module", async () => {
    for (const outline of topicOutlines) {
      const lesson = await outline.load();
      expect(lesson.id, outline.routeSlug).toBe(outline.id);
      expect(lesson.routeSlug).toBe(outline.routeSlug);
      expect(lesson.title).toBe(outline.title);
      expect(lesson.taskNumbers).toEqual(outline.taskNumbers);
      expect(lesson.status).toBe(outline.status);
      expect(lesson.accessTier).toBe(outline.accessTier);
      expect(Boolean(lesson.paidPractice)).toBe(outline.paidPractice);
      expect(
        lessonSubtopics(lesson).map((subtopic) => ({
          slug: subtopic.slug,
          title: subtopic.title,
          lead: subtopic.lead,
          level: subtopic.level,
          paid: Boolean(subtopic.paid),
          sections: subtopic.conceptIds,
        })),
      ).toEqual(
        outline.subtopics.map((subtopic) => ({
          lead: undefined,
          ...subtopic,
        })),
      );
    }
  });

  it("match every course lesson module", async () => {
    for (const outline of courseLessonOutlines) {
      const lesson = await outline.load();
      expect(lesson.id, outline.id).toBe(outline.id);
      expect(lesson.routeSlug).toBe(outline.routeSlug);
      expect(lesson.title).toBe(outline.title);
      expect(lesson.status).toBe(outline.status);
      expect(lesson.accessTier).toBe(outline.accessTier);
      expect(lesson.level).toBe(outline.level);
      expect(lesson.masteryThreshold).toBe(outline.masteryThreshold);
      expect(
        lesson.paid ? { selfCheck: lesson.paid.selfCheck } : undefined,
      ).toEqual(outline.paid);
    }
  });
});
