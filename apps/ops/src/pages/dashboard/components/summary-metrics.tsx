import { Card, SimpleGrid, Text } from "@mantine/core";
import type { DashboardData, DashboardRange } from "../../../../contracts/index";
import styles from "../dashboard-page.module.css";

type MetricCardProps = { label: string; value: string; detail: string };

const MetricCard: React.FC<MetricCardProps> = (props) => (
  <Card className={styles.metricCard} padding="md" radius="sm">
    <Text className={styles.utilityLabel}>{props.label}</Text>
    <Text className={styles.metricValue}>{props.value}</Text>
    <Text size="xs" c="dimmed">
      {props.detail}
    </Text>
  </Card>
);

export const SummaryMetrics: React.FC<{
  data: DashboardData;
  range: DashboardRange;
}> = ({ data, range }) => {
  const sourceStatuses = Object.values(data.sources);
  const freshSources = sourceStatuses.filter((item) => item.state === "fresh").length;
  return (
    <SimpleGrid cols={{ base: 2, sm: 3, lg: 9 }}>
      <MetricCard
        label="EDGE"
        value={data.summary.availability}
        detail={data.summary.version.slice(0, 8) || "—"}
      />
      <MetricCard label="CPU" value={`${data.summary.cpu}%`} detail="warning 70%" />
      <MetricCard label="RAM" value={`${data.summary.memory}%`} detail="warning 75%" />
      <MetricCard label="DISK" value={`${data.summary.disk}%`} detail="warning 70%" />
      <MetricCard label="VISITS" value={String(data.summary.visits)} detail={range} />
      <MetricCard
        label="LIVE 30M"
        value={String(data.summary.realtime.visitors)}
        detail={`${data.summary.realtime.views} views · ${data.summary.realtime.events} events`}
      />
      <MetricCard label="ERRORS" value={String(data.summary.errors)} detail={range} />
      <MetricCard label="BANS" value={String(data.summary.activeBans)} detail="active" />
      <MetricCard
        label="SOURCES"
        value={`${freshSources}/${sourceStatuses.length}`}
        detail="fresh"
      />
    </SimpleGrid>
  );
};
