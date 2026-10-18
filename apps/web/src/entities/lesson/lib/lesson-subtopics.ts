import type { LessonContent } from "./define-lesson.types";

/** Final topic page slug; no subtopic may use it. */
export const lessonPracticeSlug = "praktika";

export type ResolvedSubtopic = LessonContent.Subtopic & {
  index: number;
  level: LessonContent.SubtopicLevel;
  access: LessonContent.AccessTier;
  /** The free subtopic's blocks; empty for a paid one (see `paid.load`). */
  concepts: readonly LessonContent.ConceptBlock[];
  /** Anchors and headings of every section, free or paid. */
  outline: readonly LessonContent.ConceptOutline[];
};

/** Text mark of an advanced subtopic in the tree, the subtopic head and the pager. */
export const advancedLevelLabel = "дополнительный урок";

export function lessonSubtopics(
  lesson: LessonContent.Definition,
): ResolvedSubtopic[] {
  const concepts = new Map(
    lesson.theory.map((concept) => [concept.id, concept]),
  );
  return (lesson.subtopics ?? []).map((subtopic, index) => {
    const own = subtopic.conceptIds.flatMap((id) => {
      const concept = concepts.get(id);
      return concept ? [concept] : [];
    });
    return {
      ...subtopic,
      index,
      level: subtopic.level ?? "core",
      access: subtopic.access ?? "free",
      concepts: own,
      outline: subtopic.paid
        ? subtopic.paid.outline
        : own.map((concept) => ({
            id: concept.id,
            navLabel: concept.navLabel,
          })),
    };
  });
}

/** Every theory section of the topic, free or paid, in authored order. */
export function lessonSections(
  lesson: LessonContent.Definition,
): LessonContent.ConceptOutline[] {
  return lessonSubtopics(lesson).flatMap((subtopic) => subtopic.outline);
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
  const split = subtopics
    .filter((subtopic) => !subtopic.paid)
    .flatMap((subtopic) => subtopic.conceptIds);
  const theory = lesson.theory.map((concept) => concept.id);
  if (split.join("\n") !== theory.join("\n")) {
    errors.push(
      `${lesson.id}: subtopics must list every theory block once, in authored order`,
    );
  }
  for (const subtopic of subtopics) {
    const paid = (subtopic.access ?? "free") === "paid";
    if (paid !== Boolean(subtopic.paid)) {
      errors.push(
        `${lesson.id}: subtopic "${subtopic.slug}" must carry its paid module exactly when paid`,
      );
    }
    if (
      subtopic.paid &&
      subtopic.paid.outline.map((item) => item.id).join("\n") !==
        subtopic.conceptIds.join("\n")
    ) {
      errors.push(
        `${lesson.id}: the outline of "${subtopic.slug}" must follow its conceptIds`,
      );
    }
  }
  if (Boolean(lesson.paidPractice) === (lesson.result !== undefined)) {
    errors.push(
      `${lesson.id}: «Практика и итог» needs either its result or its paid module`,
    );
  }
  return errors;
}
