import { Typography } from "~/shared/components/typography";
import styles from "../course-overview-page.module.css";

type Props = {
  outcomes: readonly string[];
};

export const CourseOverviewOutcomes: React.FC<Props> = (props) => (
  <section className={styles.outcomes} aria-labelledby="course-outcomes">
    <Typography.Title order={2} id="course-outcomes">
      Чему вы научитесь
    </Typography.Title>
    <ul>
      {props.outcomes.map((outcome) => (
        <li key={outcome}>{outcome}</li>
      ))}
    </ul>
  </section>
);
