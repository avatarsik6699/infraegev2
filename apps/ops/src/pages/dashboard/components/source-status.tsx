import { Badge, Group, Text } from "@mantine/core";
import type { DashboardData, SourceState } from "../../../../contracts/index";
import styles from "../dashboard-page.module.css";

const STATE_COLOR: Record<SourceState, string> = {
  fresh: "teal",
  stale: "yellow",
  unavailable: "red",
};

const time = (value: string): string =>
  new Date(value).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const SourceStatus: React.FC<{ data: DashboardData }> = ({ data }) => (
  <Group
    className={styles.sourceTape}
    gap="xs"
    role="status"
    aria-live="polite"
  >
    {Object.entries(data.sources).map(([source, status]) => (
      <Badge
        key={source}
        color={STATE_COLOR[status.state]}
        variant="light"
        title={status.message}
      >
        {source}: {status.state} · {time(status.updatedAt)}
      </Badge>
    ))}
    <Text size="xs" c="dimmed">
      срез {time(data.generatedAt)}
    </Text>
  </Group>
);
