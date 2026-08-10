import { Box, Group, NativeSelect, SegmentedControl, Stack, Text, Title } from "@mantine/core";
import {
  DASHBOARD_RANGES,
  type DashboardRange,
  type ProjectSummary,
} from "../../../../contracts/index";
import styles from "../dashboard-page.module.css";
import type { DashboardRefreshMs } from "../model/use-dashboard";

type DashboardHeaderProps = {
  projects: ProjectSummary[];
  projectId: string;
  range: DashboardRange;
  refreshMs: DashboardRefreshMs;
  refreshing: boolean;
  disabled: boolean;
  onProjectChange(projectId: string): void;
  onRangeChange(range: DashboardRange): void;
  onRefreshMsChange(refreshMs: DashboardRefreshMs): void;
  onRefresh(): void;
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = (props) => (
  <Group className={styles.header} justify="space-between">
    <Box>
      <Text className={styles.eyebrow}>INFRAEGE / OPERATIONS DESK</Text>
      <Title order={1}>Состояние системы</Title>
      <Text c="dimmed">Один экран для нагрузки, обучения и инцидентов.</Text>
    </Box>
    <Group className={styles.controls} align="flex-end">
      <Stack gap={4}>
        <Text className={styles.controlLabel}>PROJECT</Text>
        <NativeSelect
          aria-label="Проект"
          value={props.projectId}
          disabled={props.disabled}
          onChange={(event) => props.onProjectChange(event.currentTarget.value)}
          data={props.projects.map((project) => ({
            value: project.id,
            label: project.name,
          }))}
        />
      </Stack>
      <Stack gap={4}>
        <Text className={styles.controlLabel}>HISTORY</Text>
        <SegmentedControl
          aria-label="Период"
          value={props.range}
          disabled={props.disabled}
          onChange={(value) => props.onRangeChange(value as DashboardRange)}
          data={[...DASHBOARD_RANGES]}
        />
      </Stack>
      <Stack gap={4}>
        <Text className={styles.controlLabel}>REFRESH</Text>
        <SegmentedControl
          aria-label="Частота обновления"
          value={String(props.refreshMs)}
          disabled={props.disabled}
          onChange={(value) => props.onRefreshMsChange(Number(value) as DashboardRefreshMs)}
          data={[
            { value: "15000", label: "15s" },
            { value: "30000", label: "30s" },
            { value: "60000", label: "60s" },
            { value: "0", label: "PAUSE" },
          ]}
        />
      </Stack>
      <button
        className={styles.refreshButton}
        type="button"
        aria-label="Обновить сейчас"
        disabled={props.disabled || props.refreshing}
        data-live={props.refreshMs > 0}
        onClick={props.onRefresh}
      >
        {props.refreshing ? "ОБНОВЛЕНИЕ…" : "ОБНОВИТЬ"}
      </button>
    </Group>
  </Group>
);
