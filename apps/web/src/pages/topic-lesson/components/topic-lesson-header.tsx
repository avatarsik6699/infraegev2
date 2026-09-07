import { BackLink } from "~/shared/components/back-link";
import { topicCatalog, type TopicCatalogTypes } from "~/entities/topic-catalog";
import { Typography } from "~/shared/components/typography";
import { PublicHeader } from "~/widgets/public-header";
import styles from "../topic-lesson-page.module.css";

type Props = {
  taskNumbers: TopicCatalogTypes.TaskNumbers;
  title: string;
};

export const TopicLessonHeader: React.FC<Props> = (props) => (
  <>
    <PublicHeader />
    <div className={styles.contextBar} data-topic-lesson-context>
      <div className={styles.contextArea}>
        <BackLink>Назад</BackLink>
      </div>
      <Typography.Text className={styles.contextLesson}>
        {`${topicCatalog.formatTaskNumbers(props.taskNumbers)} · ${props.title}`}
      </Typography.Text>
    </div>
  </>
);
