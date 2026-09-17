import { practiceCatalog } from "~/entities/practice-task";
import { useState } from "react";
import { getPracticeTask } from "./api/get-practice-task";
import { useRouter } from "@tanstack/react-router";
import { PublicHeader } from "~/widgets/public-header";
import { PublicFooter } from "~/widgets/public-footer";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import { ActionLink } from "~/shared/components/action-link";
import { Button } from "~/shared/components/button";
import { StatusScene } from "~/shared/components/status-scene";
import { PracticeSources } from "./components/practice-sources";
import { PracticeSolving } from "./components/practice-solving";
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
        <ActionLink
          to={practiceCatalog.returnHref(props.search)}
          icon="back"
          hierarchy="quiet"
          className={styles.back}
        >
          К списку задач
        </ActionLink>
        {detail ? (
          <>
            <header className={styles.heading}>
              <Typography.Title order={1} variant="lesson">
                {detail.task.title}
              </Typography.Title>
              <Typography.Text tone="muted" variant="caption">
                {detail.examNumbers.map((number) => `№${number}`).join(", ")}
                {detail.examNumbers.length ? " · " : ""}
                {detail.task.difficultyLabel}
                {detail.estimatedMinutes
                  ? ` · около ${detail.estimatedMinutes} мин`
                  : ""}
              </Typography.Text>
            </header>
            <PracticeSolving
              key={detail.task.id}
              task={detail.task}
              onRefresh={refresh}
              search={props.search}
              catalogVisible={detail.catalogVisible}
            />
            {result.links.length > 0 && (
              <nav className={styles.theory} aria-label="Теория к задаче">
                <Typography.Title order={2}>Повторить теорию</Typography.Title>
                {result.links.map((link) => (
                  <ActionLink key={link.href} to={link.href} hierarchy="text">
                    {link.label}
                  </ActionLink>
                ))}
              </nav>
            )}
            <PracticeSources sources={detail.sources} />
          </>
        ) : (
          <section className={styles.state}>
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
            {result.status === "unavailable" && (
              <Button
                onClick={() => {
                  void router.invalidate();
                }}
              >
                Повторить загрузку
              </Button>
            )}
            <ActionLink to="/practice">Открыть каталог</ActionLink>
          </section>
        )}
      </PageContainer>
      <PublicFooter />
    </div>
  );
};
