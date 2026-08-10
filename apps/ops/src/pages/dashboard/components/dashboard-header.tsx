import { Box, Group, NativeSelect, SegmentedControl, Text, Title } from "@mantine/core";
import {
  DASHBOARD_RANGES,
  type DashboardRange,
  type ProjectSummary,
} from "../../../../contracts/index";
import styles from "../dashboard-page.module.css";

type DashboardHeaderProps = {
  projects: ProjectSummary[];
  projectId: string;
  range: DashboardRange;
  disabled: boolean;
  onProjectChange(projectId: string): void;
  onRangeChange(range: DashboardRange): void;
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = (props) => (
  <Group className={styles.header} justify="space-between">
    <Box>
      <Text className={styles.eyebrow}>INFRAEGE / OPERATIONS DESK</Text>
      <Title order={1}>Состояние системы</Title>
      <Text c="dimmed">Один экран для нагрузки, обучения и инцидентов.</Text>
    </Box>
    <Group className={styles.controls}>
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
      <SegmentedControl
        aria-label="Период"
        value={props.range}
        disabled={props.disabled}
        onChange={(value) => props.onRangeChange(value as DashboardRange)}
        data={[...DASHBOARD_RANGES]}
      />
    </Group>
  </Group>
);
