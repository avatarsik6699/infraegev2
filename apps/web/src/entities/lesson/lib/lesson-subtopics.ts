import type { LessonContent } from "./define-lesson.types";

/** Final topic page slug; no subtopic may use it. */
export const lessonPracticeSlug = "praktika";

export type ResolvedSubtopic = LessonContent.Subtopic & {
  index: number;
  level: LessonContent.SubtopicLevel;
  concepts: readonly LessonContent.ConceptBlock[];
};

/** Text mark of an advanced subtopic in the tree, the subtopic head and the pager. */
export const advancedLevelLabel = "дополнительный урок";

export function lessonSubtopics(
  lesson: LessonContent.Definition,
): ResolvedSubtopic[] {
  const concepts = new Map(
    lesson.theory.map((concept) => [concept.id, concept]),
  );
  return (lesson.subtopics ?? []).map((subtopic, index) => ({
    ...subtopic,
    index,
    level: subtopic.level ?? "core",
    concepts: subtopic.conceptIds.flatMap((id) => {
      const concept = concepts.get(id);
      return concept ? [concept] : [];
    }),
  }));
}

export function findSubtopic(
  lesson: LessonContent.Definition,
  slug: string,
): ResolvedSubtopic | undefined {
  return lessonSubtopics(lesson).find((subtopic) => subtopic.slug === slug);
}

/** The subtopic that owns a theory section, for old `#section` links and theory links. */
export function findSubtopicBySection(
  lesson: LessonContent.Definition,
  sectionId: string,
): ResolvedSubtopic | undefined {
  return lessonSubtopics(lesson).find((subtopic) =>
    subtopic.conceptIds.includes(sectionId),
  );
}

/** Places each task in the earliest subtopic its theory links point into. */
export function groupTasksBySubtopic<
  Task extends { theoryLinks: readonly { hash: string }[] },
>(
  lesson: LessonContent.Definition,
  tasks: readonly Task[],
): Map<string, Task[]> {
  const subtopics = lessonSubtopics(lesson);
  const groups = new Map(
    subtopics.map((subtopic) => [subtopic.slug, [] as Task[]]),
  );
  for (const task of tasks) {
    const owner = subtopics.find((subtopic) =>
      task.theoryLinks.some((link) => subtopic.conceptIds.includes(link.hash)),
    );
    if (owner) groups.get(owner.slug)?.push(task);
  }
  return groups;
}

/** Authoring errors; an empty list means the subtopics are a valid split of the theory. */
export function subtopicErrors(lesson: LessonContent.Definition): string[] {
  const subtopics = lesson.subtopics ?? [];
  const errors: string[] = [];
  if (lesson.status === "published" && subtopics.length === 0) {
    errors.push(`${lesson.id}: a published topic needs subtopics`);
  }
  if (subtopics.length === 0) return errors;
  const slugs = new Set<string>();
  for (const subtopic of subtopics) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(subtopic.slug)) {
      errors.push(`${lesson.id}: invalid subtopic slug "${subtopic.slug}"`);
    }
    if (subtopic.slug === lessonPracticeSlug) {
      errors.push(`${lesson.id}: "${lessonPracticeSlug}" is reserved`);
    }
    if (slugs.has(subtopic.slug)) {
      errors.push(`${lesson.id}: duplicate subtopic slug "${subtopic.slug}"`);
    }
    slugs.add(subtopic.slug);
  }
  const levels = subtopics.map((subtopic) => subtopic.level ?? "core");
  if (!levels.includes("core")) {
    errors.push(`${lesson.id}: a topic needs at least one core subtopic`);
  }
  if (
    levels.indexOf("advanced") >= 0 &&
    levels.lastIndexOf("core") > levels.indexOf("advanced")
  ) {
    errors.push(`${lesson.id}: advanced subtopics must follow all core ones`);
  }
  const split = subtopics.flatMap((subtopic) => subtopic.conceptIds);
  const theory = lesson.theory.map((concept) => concept.id);
  if (split.join("\n") !== theory.join("\n")) {
    errors.push(
      `${lesson.id}: subtopics must list every theory block once, in authored order`,
    );
  }
  return errors;
}
