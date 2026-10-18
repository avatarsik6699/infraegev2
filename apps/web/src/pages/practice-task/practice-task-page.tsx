import { FileText, Clock } from "lucide-react";
import {
  practiceCatalog,
  PracticeDifficulty,
  practiceAnswerFormat,
} from "~/entities/practice-task";
import { useState } from "react";
import {
  getPracticeTask,
  PracticeTask,
  PracticeTheory,
} from "~/widgets/practice-task";
import { useRouter } from "@tanstack/react-router";
import { PublicHeader } from "~/widgets/public-header";
import { PublicFooter } from "~/widgets/public-footer";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import { PracticeBackLink } from "./components/practice-back-link";
import { Button } from "~/shared/components/button";
import { StatusScene } from "~/shared/components/status-scene";
import { LockedTaskState } from "./components/locked-task-state";
import { PracticeSources } from "./components/practice-sources";
import { practiceTopic } from "./practice-topic";
import type { PracticeTaskPageTypes } from "./practice-task-page.types";
import styles from "./practice-task-page.module.css";

export const PracticeTaskPage: React.FC<PracticeTaskPageTypes.Props> = (
  props,
) => {
  const router = useRouter();
  const [refreshed, setRefreshed] = useState<
    PracticeTaskPageTypes.Props["result"] | null
  >(null);
  const result = refreshed ?? props.result;
  const detail = result.detail;
  const refresh = async () => {
    if (!detail) return;
    const next = await getPracticeTask({ data: detail.task.id });
    if (!next.detail) throw new Error("Practice refresh unavailable");
    setRefreshed(next);
  };
  return (
    <div className={styles.page}>
      <PublicHeader activeSection="practice" />
      <PageContainer component="main" measure="reading" className={styles.main}>
        {detail ? (
          <>
            <header className={styles.heading}>
              <div className={styles.context}>
                <PracticeBackLink
                  href={practiceCatalog.returnHref(props.search)}
                />
                <Typography.Text className={styles.topic}>
                  {practiceTopic.label(detail)}
                </Typography.Text>
              </div>
              <Typography.Title
                order={1}
                variant="lesson"
                className={styles.title}
              >
                {detail.task.title}
              </Typography.Title>
              <div className={styles.metadata}>
                <span
                  className={styles.id}
                  title={detail.task.id}
                  aria-label={`ID: ${detail.task.id}`}
                >
                  #{detail.task.id.slice(0, 8)}
                </span>
                <PracticeDifficulty level={detail.difficulty} />
                <span
                  className={styles.metaItem}
                  title={detail.answerInstruction}
                >
                  <FileText size={16} aria-hidden="true" />
                  {practiceAnswerFormat.label(detail.answerInstruction)}
                </span>
                {detail.estimatedMinutes ? (
                  <span className={styles.metaItem}>
                    <Clock size={16} aria-hidden="true" />
                    Около {detail.estimatedMinutes} мин
                  </span>
                ) : null}
                <PracticeSources sources={detail.sources} />
                <PracticeTheory links={result.links} />
              </div>
            </header>
            <div className={styles.task}>
              <PracticeTask
                key={detail.task.id}
                task={detail.task}
                links={result.links}
                saveProgress={detail.catalogVisible}
                onRefresh={refresh}
              />
            </div>
          </>
        ) : (
          <section className={styles.state}>
            <PracticeBackLink href={practiceCatalog.returnHref(props.search)} />

            {result.status === "locked" ? (
              <LockedTaskState />
            ) : (
              <StatusScene
                kind="code"
                code={result.status === "missing" ? "404" : "503"}
                title={
                  result.status === "missing"
                    ? "Задача недоступна"
                    : "Не удалось загрузить задачу"
                }
                description={
                  result.status === "missing"
                    ? "Вернитесь в каталог и выберите другую задачу."
                    : "Попробуйте ещё раз немного позже."
                }
              />
            )}
            {result.status === "unavailable" && (
              <Button
                onClick={() => {
                  void router.invalidate();
                }}
              >
                Повторить загрузку
              </Button>
            )}
          </section>
        )}
      </PageContainer>
      <PublicFooter />
    </div>
  );
};
