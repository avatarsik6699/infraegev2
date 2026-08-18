import type { ErrorComponentProps } from "@tanstack/react-router";
import { useEffect } from "react";
import { ActionLink } from "~/shared/components/action-link";
import { Button } from "~/shared/components/button";
import { Callout } from "~/shared/components/callout";
import { EmptyState } from "~/shared/components/empty-state";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import {
  isChunkLoadError,
  reportClientError,
} from "~/shared/lib/client-errors";
import styles from "./route-state.module.css";

export const RoutePending: React.FC = () => (
  <PageContainer>
    <section className={styles.pending} aria-busy="true">
      <span className={styles.visuallyHidden} role="status">
        Загружаем страницу
      </span>
      <div className={styles.skeletonStack} aria-hidden="true">
        <span className={styles.skeleton} data-size="title" />
        <span className={styles.skeleton} />
        <span className={styles.skeleton} />
        <span className={styles.skeleton} data-size="short" />
      </div>
    </section>
  </PageContainer>
);

export const RouteError: React.FC<ErrorComponentProps> = (props) => {
  useEffect(
    function reportRouteErrorFx() {
      void reportClientError(
        props.info
          ? "render"
          : isChunkLoadError(props.error)
            ? "chunk_load"
            : "route_load",
        "/",
        props.error,
      );
    },
    [props.error, props.info],
  );

  return (
    <PageContainer>
      <div className={styles.stateCard} role="alert">
        <Callout tone="warning" title="Не удалось загрузить страницу">
          <Typography.Text>
            Повторите загрузку. Пользовательские данные не включаются в отчёт об
            ошибке.
          </Typography.Text>
          <div className={styles.actions}>
            <Button onClick={props.reset}>Повторить</Button>
            <ActionLink to="/" hierarchy="quiet">
              На стартовую страницу
            </ActionLink>
          </div>
        </Callout>
      </div>
    </PageContainer>
  );
};

export const RouteNotFound: React.FC = () => (
  <PageContainer>
    <div className={styles.stateCard}>
      <EmptyState
        headingOrder={1}
        title="Страница не найдена"
        description="Ошибка 404. Проверьте адрес или вернитесь на стартовую страницу."
        action={<ActionLink to="/">На стартовую страницу</ActionLink>}
      />
    </div>
  </PageContainer>
);
