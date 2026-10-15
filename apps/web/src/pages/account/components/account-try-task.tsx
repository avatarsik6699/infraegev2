import { useEffect, useState } from "react";
import { ActionLink } from "~/shared/components/action-link";
import { Typography } from "~/shared/components/typography";
import { getNextBankTask, type NextBankTask } from "../api/get-next-bank-task";
import styles from "./account-overview.module.css";

/** «Попробуйте задачу»: the next bank task after the furthest saved one, else the bank. */
export const AccountTryTask: React.FC<{ savedTaskIds: readonly string[] }> = (
  props,
) => {
  const furthest = [...props.savedTaskIds].sort().at(-1);
  const [task, setTask] = useState<NextBankTask | null>(null);
  useEffect(
    function loadNextBankTaskFx() {
      if (!furthest) return;
      const controller = new AbortController();
      void getNextBankTask(furthest, controller.signal)
        .then((result) => {
          if (!controller.signal.aborted) setTask(result);
        })
        .catch(() => undefined);
      return () => controller.abort();
    },
    [furthest],
  );
  const exam = task?.examNumbers.length
    ? `, ЕГЭ ${task.examNumbers.join(", ")}`
    : "";
  return (
    <section
      className={styles.card}
      data-whole-link
      aria-labelledby="try-task-title"
    >
      <Typography.Title order={3} id="try-task-title">
        Попробуйте задачу
      </Typography.Title>
      <Typography.Text tone="muted">
        {task
          ? `Следующая в банке: «${task.title}»${exam}.`
          : "В банке задачи по всем темам ЕГЭ с проверкой ответа."}
      </Typography.Text>
      {task ? (
        <ActionLink
          hierarchy="text"
          to="/practice/$taskId"
          params={{ taskId: task.id }}
        >
          Решить
        </ActionLink>
      ) : (
        <ActionLink hierarchy="text" to="/practice">
          Открыть банк задач
        </ActionLink>
      )}
    </section>
  );
};
