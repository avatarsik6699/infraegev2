import type { PracticeTaskTypes } from "~/entities/practice-task";
import { FragmentLink } from "~/shared/components/fragment-link";
import { Typography } from "~/shared/components/typography";
import styles from "../lesson-practice.module.css";

type PracticeTaskHeadingProps = {
  task: PracticeTaskTypes.Task;
  headingId: string;
};

export const PracticeTaskHeading: React.FC<PracticeTaskHeadingProps> = (
  props,
) => (
  <div className={styles.taskHeading}>
    <Typography.Title order={3} id={props.headingId}>
      {props.task.title}
    </Typography.Title>
    {props.task.theoryLinks.length > 0 && (
      <nav
        className={styles.taskTheoryLinks}
        aria-label={`Теория к задаче «${props.task.title}»`}
      >
        <ul>
          {props.task.theoryLinks.map((link) => (
            <li key={link.hash}>
              <FragmentLink
                presentation="action"
                hierarchy="text"
                hash={link.hash}
              >
                {link.label}
              </FragmentLink>
            </li>
          ))}
        </ul>
      </nav>
    )}
  </div>
);
