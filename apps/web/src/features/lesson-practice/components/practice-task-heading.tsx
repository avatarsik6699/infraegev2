import { Badge } from "@mantine/core";
import type { LessonTypes } from "~/entities/lesson";
import { FragmentLink } from "~/shared/components/fragment-link";
import { Typography } from "~/shared/components/typography";
import styles from "../lesson-practice.module.css";

type PracticeTaskHeadingProps = {
  task: LessonTypes.PracticeTask;
  index: number;
  alreadySolved: boolean;
  headingId: string;
  setHeadingRef: (taskId: string, element: HTMLHeadingElement | null) => void;
};

export const PracticeTaskHeading: React.FC<PracticeTaskHeadingProps> = (
  props,
) => (
  <div className={styles.taskHeading}>
    <Typography.Text component="span" aria-hidden="true">
      {props.index + 1}
    </Typography.Text>
    <Typography.Title
      order={4}
      id={props.headingId}
      tabIndex={-1}
      ref={(element) => props.setHeadingRef(props.task.id, element)}
    >
      {props.task.title}
    </Typography.Title>
    <nav
      className={styles.taskTheoryLinks}
      aria-label={`Теория к задаче «${props.task.title}»`}
    >
      <Typography.Text component="span">К теории:</Typography.Text>
      {props.task.theoryLinks.map((link) => (
        <FragmentLink hash={link.hash} key={link.hash}>
          {link.label}
        </FragmentLink>
      ))}
    </nav>
    {props.alreadySolved ? (
      <Badge className={styles.solvedStatus} variant="outline">
        решено
      </Badge>
    ) : null}
  </div>
);
