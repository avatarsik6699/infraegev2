import { Link } from "@tanstack/react-router";

type PythonCourseLessonLinkProps = {
  children: React.ReactNode;
  lessonSlug: string;
};

export const PythonCourseLessonLink: React.FC<PythonCourseLessonLinkProps> = (
  props,
) => (
  <Link
    to="/courses/$courseSlug/$lessonSlug"
    params={{ courseSlug: "python", lessonSlug: props.lessonSlug }}
  >
    {props.children}
  </Link>
);
