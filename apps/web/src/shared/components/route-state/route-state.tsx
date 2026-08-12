import {
  Alert,
  Button,
  Group,
  Paper,
  Skeleton,
  Stack,
  VisuallyHidden,
} from "@mantine/core";
import { Link, type ErrorComponentProps } from "@tanstack/react-router";
import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
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
      <VisuallyHidden role="status">Загружаем страницу</VisuallyHidden>
      <Stack gap="xl" aria-hidden="true">
        <Skeleton height={18} width="30%" radius="sm" />
        <Skeleton height={48} width="72%" radius="sm" />
        <div className={styles.skeletonGrid}>
          <Stack gap="sm" className={styles.railSkeleton}>
            <Skeleton height={14} width="70%" />
            <Skeleton height={30} />
            <Skeleton height={30} />
            <Skeleton height={30} />
          </Stack>
          <Stack gap="md">
            <Skeleton height={22} width="45%" />
            <Skeleton height={16} />
            <Skeleton height={16} />
            <Skeleton height={16} width="82%" />
            <Skeleton height={180} radius="sm" />
          </Stack>
        </div>
      </Stack>
    </section>
  </PageContainer>
);

export const RouteError: React.FC<ErrorComponentProps> = (props) => {
  const routeId = useRouterState({
    select: (state) => state.matches.at(-1)?.routeId ?? "/",
  });

  useEffect(() => {
    void reportClientError(
      props.info
        ? "render"
        : isChunkLoadError(props.error)
          ? "chunk_load"
          : "route_load",
      routeId,
      props.error,
    );
  }, [props.error, props.info, routeId]);

  return (
    <PageContainer>
      <Alert
        className={styles.stateCard}
        role="alert"
        color="highlight"
        variant="light"
        title="Страница не загрузилась"
      >
        <Stack gap="md">
          <Typography.Text>
            Соединение могло прерваться. Повторите загрузку; введённые ответы не
            отправляются в отчёт об ошибке.
          </Typography.Text>
          <Group>
            <Button onClick={props.reset}>Повторить</Button>
            <Button component={Link} to="/" variant="subtle">
              На главную
            </Button>
          </Group>
        </Stack>
      </Alert>
    </PageContainer>
  );
};

export const RouteNotFound: React.FC = () => (
  <PageContainer>
    <Paper className={styles.stateCard} withBorder p="xl" radius="sm">
      <Stack gap="md">
        <Typography.Text tone="muted">Ошибка 404</Typography.Text>
        <Typography.Title order={1}>Такой страницы нет</Typography.Title>
        <Typography.Text>
          Возможно, материал ещё не опубликован или адрес изменился.
        </Typography.Text>
        <Group>
          <Button component={Link} to="/">
            К списку тем
          </Button>
        </Group>
      </Stack>
    </Paper>
  </PageContainer>
);
