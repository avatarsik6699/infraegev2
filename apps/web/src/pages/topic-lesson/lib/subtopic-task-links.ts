import { findSubtopicBySection, type LessonContent } from "~/entities/lesson";
import type { PracticeTaskTypes } from "~/entities/practice-task";
import { theoryLinkLabel } from "~/shared/lib/theory-link-label";

/** Points each task theory link at the subtopic page that owns the section
 * and names it after the section heading (F54). */
export function withSubtopicTheoryLinks(
  lesson: LessonContent.Definition,
  tasks: readonly PracticeTaskTypes.Task[],
  currentSubtopic?: string,
): PracticeTaskTypes.Task[] {
  return tasks.map((task) => ({
    ...task,
    theoryLinks: task.theoryLinks.map((link) => {
      const owner = findSubtopicBySection(lesson, link.hash);
      const label = theoryLinkLabel(lesson.theory, link.hash);
      return owner && owner.slug !== currentSubtopic
        ? {
            ...link,
            label,
            href: `/ege/${lesson.routeSlug}/${owner.slug}#${link.hash}`,
          }
        : { ...link, label };
    }),
  }));
}
