import { ActionLink } from "~/shared/components/action-link";

type PythonCourseLessonLinkProps = {
  children: React.ReactNode;
  /** The course of the lesson; the Python course when omitted. */
  courseSlug?: "python" | "excel";
  lessonSlug: string;
};

/**
 * Lessons of the earlier course that the rebuilt course (Change 175) no longer
 * has: links from older topic lessons open the lesson that now explains the
 * same technique. Those topic lessons are not edited until they are rebuilt.
 */
export const retiredCourseLessonSlugs: Readonly<Record<string, string>> = {
  "otbor-rezultata": "sortirovka-i-poisk",
  "schetchiki-i-nakopiteli": "while",
};

export const courseLessonSlug = (lessonSlug: string): string =>
  retiredCourseLessonSlugs[lessonSlug] ?? lessonSlug;

export const PythonCourseLessonLink: React.FC<PythonCourseLessonLinkProps> = (
  props,
) => (
  <ActionLink
    presentation="inline"
    icon="none"
    to="/courses/$courseSlug/$lessonSlug"
    params={{
      courseSlug: props.courseSlug ?? "python",
      lessonSlug:
        props.courseSlug === "excel"
          ? props.lessonSlug
          : courseLessonSlug(props.lessonSlug),
    }}
  >
    {props.children}
  </ActionLink>
);
