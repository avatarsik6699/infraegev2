import type {
  CourseCatalogTypes,
  CourseProgressTypes,
} from "~/entities/course";
import { ActionLink } from "~/shared/components/action-link";
import { Typography } from "~/shared/components/typography";
import { CourseCatalogProgress } from "./course-catalog-progress";
import styles from "../course-catalog-page.module.css";

type Props = {
  entry: CourseCatalogTypes.Entry;
  lessons: readonly CourseProgressTypes.Lesson[] | null;
};
export const CourseCatalogCard: React.FC<Props> = (props) => (
  <li
    className={styles.card}
    data-course-card={props.entry.id}
    data-course-status={props.entry.status}
  >
    <Typography.Title order={2}>
      {props.entry.status === "published" ? (
        <ActionLink
          presentation="navigation"
          to="/courses/$courseSlug"
          params={{ courseSlug: props.entry.routeSlug }}
        >
          {props.entry.title}
        </ActionLink>
      ) : (
        props.entry.title
      )}
    </Typography.Title>
    <Typography.Text tone="muted">{props.entry.summary}</Typography.Text>
    {props.entry.status === "published" ? (
      <>
        <Typography.Text tone="muted">
          {props.entry.lessonCount} уроков
        </Typography.Text>
        <CourseCatalogProgress lessons={props.lessons} />
      </>
    ) : (
      <Typography.Text tone="muted">В плане</Typography.Text>
    )}
  </li>
);
