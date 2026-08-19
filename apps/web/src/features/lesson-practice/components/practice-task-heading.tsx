import type { LessonTypes } from "~/entities/lesson";
import { FragmentLink } from "~/shared/components/fragment-link";
import { Typography } from "~/shared/components/typography";
import styles from "../lesson-practice.module.css";

type PracticeTaskHeadingProps = {
  task: LessonTypes.PracticeTask;
  headingId: string;
};

export const PracticeTaskHeading: React.FC<PracticeTaskHeadingProps> = (
  props,
) => (
  <div className={styles.taskHeading}>
    <Typography.Title order={3} id={props.headingId}>
      {props.task.title}
    </Typography.Title>
    <nav
      className={styles.taskTheoryLinks}
      aria-label={`Теория к задаче «${props.task.title}»`}
    >
      {props.task.theoryLinks.map((link) => (
        <FragmentLink hash={link.hash} key={link.hash}>
          {link.label}
        </FragmentLink>
      ))}
    </nav>
  </div>
);
