import type { LessonContent } from "../lib/define-lesson.types";

export type LessonPublication = {
  routeSlug: string;
  status: LessonContent.Status;
};

export const rekursiyaLessonPublication: Readonly<{
  routeSlug: "16-rekursiya";
  status: "draft";
}>;

export const lessonPublications: readonly LessonPublication[];
