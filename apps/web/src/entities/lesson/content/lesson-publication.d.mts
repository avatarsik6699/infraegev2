import type { LessonContent } from "../lib/define-lesson.types";

export type LessonPublication = {
  id: string;
  routeSlug: string;
  status: LessonContent.Status;
};

export const rekursiyaLessonPublication: Readonly<{
  id: "rekursiya";
  routeSlug: "16-rekursiya";
  status: "draft";
}>;

export const lessonPublications: readonly LessonPublication[];
