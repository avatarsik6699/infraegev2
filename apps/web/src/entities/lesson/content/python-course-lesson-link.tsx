import { ActionLink } from "~/shared/components/action-link";

type PythonCourseLessonLinkProps = {
  children: React.ReactNode;
  lessonSlug: string;
};

export const PythonCourseLessonLink: React.FC<PythonCourseLessonLinkProps> = (
  props,
) => (
  <ActionLink
    presentation="inline"
    icon="none"
    to="/courses/$courseSlug/$lessonSlug"
    params={{ courseSlug: "python", lessonSlug: props.lessonSlug }}
  >
    {props.children}
  </ActionLink>
);
