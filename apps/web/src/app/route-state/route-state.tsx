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
        <Skeleton height={32} width="45%" radius="sm" />
        <Skeleton height={16} />
        <Skeleton height={16} />
        <Skeleton height={16} width="75%" />
      </Stack>
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
      <Alert
        className={styles.stateCard}
        role="alert"
        color="gray"
        variant="light"
        title="Не удалось загрузить страницу"
      >
        <Stack gap="md">
          <Typography.Text>
            Повторите загрузку. Пользовательские данные не включаются в отчёт об
            ошибке.
          </Typography.Text>
          <Group>
            <Button onClick={props.reset}>Повторить</Button>
            <Button component={Link} to="/" variant="subtle">
              На стартовую страницу
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
        <Typography.Title order={1}>Страница не найдена</Typography.Title>
        <Typography.Text>
          Проверьте адрес или вернитесь на стартовую страницу.
        </Typography.Text>
        <Group>
          <Button component={Link} to="/" color="dark" variant="outline">
            На стартовую страницу
          </Button>
        </Group>
      </Stack>
    </Paper>
  </PageContainer>
);
