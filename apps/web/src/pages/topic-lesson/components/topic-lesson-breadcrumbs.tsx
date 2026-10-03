import { Link } from "@tanstack/react-router";
import { topicCatalog, type TopicCatalogTypes } from "~/entities/topic-catalog";
import styles from "../topic-lesson.module.css";

type Props = {
  routeSlug: string;
  taskNumbers: TopicCatalogTypes.TaskNumbers;
  title: string;
};

export const TopicLessonBreadcrumbs: React.FC<Props> = (props) => (
  <nav
    className={styles.breadcrumbs}
    aria-label="Путь к странице"
    data-topic-lesson-context
  >
    <ol>
      <li>
        <Link to="/ege">Темы ЕГЭ</Link>
      </li>
      <li>{topicCatalog.formatTaskNumbers(props.taskNumbers)}</li>
      <li>
        <Link to="/ege/$slug" params={{ slug: props.routeSlug }}>
          {props.title}
        </Link>
      </li>
    </ol>
  </nav>
);
