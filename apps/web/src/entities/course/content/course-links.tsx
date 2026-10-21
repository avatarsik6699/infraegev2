import { ActionLink } from "~/shared/components/action-link";

/** Link to a lesson of the Python course, e.g. from the course map (7.2). */
export const CourseLessonLink: React.FC<{
  lessonSlug: string;
  children: React.ReactNode;
}> = (props) => (
  <ActionLink
    presentation="inline"
    icon="none"
    to="/courses/$courseSlug/$lessonSlug"
    params={{ courseSlug: "python", lessonSlug: props.lessonSlug }}
  >
    {props.children}
  </ActionLink>
);

/** Link to an exam topic page, e.g. from the course map (7.2). */
export const ExamTopicLink: React.FC<{
  routeSlug: string;
  children: React.ReactNode;
}> = (props) => (
  <ActionLink
    presentation="inline"
    icon="none"
    to="/ege/$slug"
    params={{ slug: props.routeSlug }}
  >
    {props.children}
  </ActionLink>
);
