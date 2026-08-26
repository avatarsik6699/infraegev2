import type { LessonContent } from "~/entities/lesson";
import type { CourseTypes } from "../course.types";

export type CoursePublication = Omit<CourseTypes.Definition, "modules"> & {
  modules: readonly CourseTypes.Module[];
};

export type CourseLessonPublication = {
  id: string;
  routeSlug: string;
  title: string;
  summary: string;
  status: LessonContent.Status;
  practiceTaskIds: readonly string[];
};

export const pythonFirstProgramLessonPublication: Readonly<CourseLessonPublication>;
export const pythonCoursePublication: Readonly<CoursePublication>;
export const coursePublications: readonly CoursePublication[];
export const courseLessonPublications: readonly CourseLessonPublication[];
