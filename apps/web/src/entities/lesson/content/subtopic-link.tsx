import { ActionLink } from "~/shared/components/action-link";

type Props = {
  routeSlug: string;
  subtopic: string;
  children: React.ReactNode;
};

/** Link to a subtopic page of a topic lesson, e.g. from its cheat sheet. */
export const SubtopicLink: React.FC<Props> = (props) => (
  <ActionLink
    presentation="inline"
    icon="none"
    to="/ege/$slug/$subtopic"
    params={{ slug: props.routeSlug, subtopic: props.subtopic }}
  >
    {props.children}
  </ActionLink>
);
