import { Link } from "@tanstack/react-router";
import { Typography } from "~/shared/components/typography";
import styles from "../topic-lesson-page.module.css";

type Props = {
  taskNumber: number;
  title: string;
};

export const TopicLessonHeader: React.FC<Props> = (props) => (
  <>
    <header className={styles.siteHeader} data-topic-lesson-header>
      <Link aria-label="infraege — на главную" className={styles.brand} to="/">
        infraege
      </Link>
    </header>
    <div className={styles.contextBar} data-topic-lesson-context>
      <Typography.Text className={styles.contextArea}>
        ЕГЭ по информатике
      </Typography.Text>
      <Typography.Text className={styles.contextLesson}>
        {`Задание ${String(props.taskNumber)} · ${props.title}`}
      </Typography.Text>
      <Typography.Text className={styles.contextMobile}>
        {`Задание ${String(props.taskNumber)} · ЕГЭ по информатике`}
      </Typography.Text>
    </div>
  </>
);
