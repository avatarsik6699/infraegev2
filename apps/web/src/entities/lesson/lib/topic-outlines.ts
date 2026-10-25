import { topicOutlines } from "../content/topic-outlines.gen";
import type { LessonContent } from "./define-lesson.types";

export { topicOutlines };

/** A topic by its public slug, without loading its content (Change 222). */
export function findTopicOutline(
  routeSlug: string,
): LessonContent.Outline | undefined {
  return topicOutlines.find((outline) => outline.routeSlug === routeSlug);
}

/** Published topics in exam order: the topic tree and the free-scope summary. */
export function publishedTopicOutlines(): LessonContent.Outline[] {
  return topicOutlines
    .filter((outline) => outline.status === "published")
    .sort((a, b) => a.taskNumbers[0] - b.taskNumbers[0]);
}

/** The subtopic that owns a theory section, for old `#section` links. */
export function findOutlineSubtopicBySection(
  outline: LessonContent.Outline,
  sectionId: string,
): LessonContent.SubtopicOutline | undefined {
  return outline.subtopics.find((subtopic) =>
    subtopic.sections.includes(sectionId),
  );
}
