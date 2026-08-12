import { Badge, Group, Text } from "@mantine/core";
import { useEffect, useState } from "react";
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

const age = (value: string, now: number): string => {
  const seconds = Math.max(
    0,
    Math.floor((now - new Date(value).getTime()) / 1000),
  );
  if (seconds < 5) return "только что";
  if (seconds < 60) return `${seconds}с назад`;
  if (seconds < 3_600) return `${Math.floor(seconds / 60)}м назад`;
  return time(value);
};

function useClock(value: string): number {
  const [now, setNow] = useState(() => new Date(value).getTime());
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 5_000);
    return () => window.clearInterval(interval);
  }, [value]);
  return now;
}

export const SourceStatus: React.FC<{ data: DashboardData }> = ({ data }) => {
  const now = useClock(data.generatedAt);
  return (
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
      <Text size="xs" c="dimmed" title={time(data.generatedAt)}>
        срез {age(data.generatedAt, now)}
      </Text>
    </Group>
  );
};
