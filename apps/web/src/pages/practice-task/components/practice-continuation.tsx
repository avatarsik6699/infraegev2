import { useEffect, useState } from "react";
import {
  practiceCatalog,
  type PracticeCatalogTypes,
} from "~/entities/practice-task";
import { ActionLink } from "~/shared/components/action-link";
import { Button } from "~/shared/components/button";
import { Typography } from "~/shared/components/typography";
import { getNextPracticeTask } from "../api/get-next-practice-task";
import styles from "../practice-task-page.module.css";

export const PracticeContinuation: React.FC<{
  id: string;
  search: PracticeCatalogTypes.TaskSearch;
}> = (props) => {
  const [result, setResult] = useState<Awaited<
    ReturnType<typeof getNextPracticeTask>
  > | null>(null);
  const [attempt, setAttempt] = useState(0);
  const selection = practiceCatalog.href(props.search);
  const skill = props.search.skill;
  const exam = props.search.exam_number;
  const difficulty = props.search.difficulty;
  useEffect(
    function loadNextTaskFx() {
      let current = true;
      void getNextPracticeTask({
        data: {
          id: props.id,
          search: { skill, exam_number: exam, difficulty },
        },
      }).then(
        (value) => {
          if (current) setResult(value);
        },
        () => {
          if (current) setResult({ status: "unavailable", taskId: null });
        },
      );
      return () => {
        current = false;
      };
    },
    [props.id, skill, exam, difficulty, selection, attempt],
  );
  return (
    <nav className={styles.continuation} aria-label="Продолжить практику">
      {!result && (
        <Typography.Text tone="muted" role="status">
          Ищем следующую задачу…
        </Typography.Text>
      )}
      {result?.status === "ready" &&
        (result.taskId ? (
          <ActionLink
            to={practiceCatalog.taskHref(result.taskId, props.search)}
            hierarchy="drawn"
            icon="forward"
          >
            Следующая задача
          </ActionLink>
        ) : (
          <Typography.Text>
            Это последняя задача в выбранном списке.
          </Typography.Text>
        ))}
      {result?.status === "unavailable" && (
        <>
          <Typography.Text role="status" tone="muted">
            Не удалось загрузить продолжение.
          </Typography.Text>
          <Button
            hierarchy="quiet"
            onClick={() => {
              setResult(null);
              setAttempt((value) => value + 1);
            }}
          >
            Повторить загрузку продолжения
          </Button>
        </>
      )}
      <ActionLink
        to={practiceCatalog.returnHref(props.search)}
        hierarchy="quiet"
      >
        Вернуться к списку
      </ActionLink>
    </nav>
  );
};
