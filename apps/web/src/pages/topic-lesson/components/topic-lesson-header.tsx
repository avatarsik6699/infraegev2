import { BackLink } from "~/shared/components/back-link";
import { Typography } from "~/shared/components/typography";
import { PublicHeader } from "~/widgets/public-header";
import styles from "../topic-lesson-page.module.css";

type Props = {
  taskNumber: number;
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
        {`Задание ${String(props.taskNumber)} · ${props.title}`}
      </Typography.Text>
    </div>
  </>
);
