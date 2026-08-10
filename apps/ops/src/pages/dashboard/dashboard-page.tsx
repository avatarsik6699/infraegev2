import { Alert, Container, Group, Loader, Skeleton, Stack, Text } from "@mantine/core";
import { lazy, Suspense, useState } from "react";
import type { DashboardRange } from "../../../contracts/index";
import { DashboardHeader } from "./components/dashboard-header";
import { IncidentTables } from "./components/incident-tables";
import { OperationsTables } from "./components/operations-tables";
import { SourceStatus } from "./components/source-status";
import { SummaryMetrics } from "./components/summary-metrics";
import { useDashboard } from "./model/use-dashboard";
import { useProjects } from "./model/use-projects";

const TelemetryCharts = lazy(() => import("./components/telemetry-charts"));

export const DashboardPage: React.FC = () => {
  const projectsState = useProjects();
  const [projectId, setProjectId] = useState("");
  const [range, setRange] = useState<DashboardRange>("24h");
  const selectedProjectId = projectsState.projects.some(
    (project) => project.id === projectId,
  )
    ? projectId
    : (projectsState.projects[0]?.id ?? "");
  const dashboard = useDashboard(selectedProjectId, range);

  const controlsDisabled = projectsState.status !== "ready" || projectsState.projects.length === 0;

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <DashboardHeader
          projects={projectsState.projects}
          projectId={selectedProjectId}
          range={range}
          disabled={controlsDisabled}
          onProjectChange={setProjectId}
          onRangeChange={setRange}
        />

        {projectsState.status === "error" && (
          <Alert color="red">Конфигурация проектов недоступна</Alert>
        )}
        {projectsState.status === "ready" && projectsState.projects.length === 0 && (
          <Alert color="yellow">В конфигурации нет доступных проектов</Alert>
        )}
        {dashboard.error && (
          <Alert color="red">
            {dashboard.data
              ? "Не удалось обновить dashboard — показан последний успешный срез"
              : "Не удалось загрузить dashboard"}
          </Alert>
        )}
        {dashboard.refreshing && (
          <Text role="status" size="xs" c="dimmed">
            Обновление данных…
          </Text>
        )}

        {(projectsState.status === "loading" || dashboard.loading) && !dashboard.data && (
          <Group justify="center" py="xl">
            <Loader aria-label="Загрузка данных" />
          </Group>
        )}

        {dashboard.data && (
          <>
            <SourceStatus data={dashboard.data} />
            <SummaryMetrics data={dashboard.data} range={range} />
            <Suspense fallback={<Skeleton height={320} aria-label="Загрузка графиков" />}>
              <TelemetryCharts data={dashboard.data} />
            </Suspense>
            <OperationsTables data={dashboard.data} />
            <IncidentTables data={dashboard.data} />
          </>
        )}
      </Stack>
    </Container>
  );
};
