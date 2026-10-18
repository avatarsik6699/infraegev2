import { Lock } from "lucide-react";
import {
  PracticeDifficulty,
  type PracticeTaskTypes,
} from "~/entities/practice-task";
import { ActionLink } from "~/shared/components/action-link";
import { Typography } from "~/shared/components/typography";
import styles from "./locked-tasks.module.css";

type Props = {
  tasks: readonly PracticeTaskTypes.LockedTask[];
  /** Number of the first card: locked tasks follow the open ones. */
  start: number;
  /** This page's path: checkout returns here. */
  from: string;
};

/** Change 192: paid tasks without their statements, after the open ones. */
export const LockedTasks: React.FC<Props> = (props) => {
  const { from } = props;
  if (!props.tasks.length) return null;
  return (
    <ul
      className={styles.list}
      aria-label="Задачи с полным доступом"
      data-locked-tasks
    >
      {props.tasks.map((task, index) => (
        <li key={task.id} className={styles.task} data-locked-task={task.id}>
          <div className={styles.strip}>
            <b>{`Задача ${String(props.start + index)}`}</b>
            <PracticeDifficulty level={task.difficulty} />
            <Lock className={styles.lock} aria-hidden="true" />
          </div>
          <div className={styles.body}>
            <Typography.Text className={styles.title}>
              {task.title}
            </Typography.Text>
            {task.skills.length ? (
              <ul className={styles.skills} aria-label="Навыки">
                {task.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            ) : null}
            <div className={styles.foot}>
              <span>Условие и проверка ответа — с полным доступом.</span>
              <ActionLink
                presentation="button"
                hierarchy="secondary"
                to="/pricing"
                search={{ from }}
              >
                Открыть доступ
              </ActionLink>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
