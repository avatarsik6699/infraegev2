import { AreaChart, LineChart } from "@mantine/charts";
import { Card, SimpleGrid, Text, Title } from "@mantine/core";
import type { DashboardData } from "../../../../contracts/index";
import styles from "../dashboard-page.module.css";

const last = <T,>(items: T[]): T | undefined => items.at(-1);
const metric = (value: number): string =>
  Number.isInteger(value) ? String(value) : value.toFixed(1);

const TelemetryCharts: React.FC<{ data: DashboardData }> = ({ data }) => {
  const resource = last(data.resourceSeries);
  const traffic = last(data.trafficSeries);
  const resourceSummary = resource
    ? `Последний срез: CPU ${metric(resource.cpu)}%, RAM ${metric(resource.memory)}%, load ${resource.load.toFixed(2)}.`
    : "Данных о нагрузке за выбранный период нет.";
  const trafficSummary = traffic
    ? `Последний срез: ${traffic.pageviews} просмотров и ${traffic.sessions} сессий.`
    : "Данных о трафике за выбранный период нет.";

  return (
    <SimpleGrid cols={{ base: 1, lg: 2 }}>
      <Card withBorder radius="sm" aria-labelledby="resource-chart-title">
        <Title id="resource-chart-title" order={2}>
          Нагрузка
        </Title>
        <Text className={styles.chartSummary} size="sm" c="dimmed">
          {resourceSummary}
        </Text>
        <LineChart
          aria-label="График нагрузки CPU и RAM"
          accessibilityLayer
          h={260}
          data={data.resourceSeries}
          dataKey="time"
          series={[
            { name: "cpu", label: "CPU %", color: "indigo.5" },
            { name: "memory", label: "RAM %", color: "orange.6" },
          ]}
          curveType="linear"
          withLegend
        />
      </Card>
      <Card withBorder radius="sm" aria-labelledby="traffic-chart-title">
        <Title id="traffic-chart-title" order={2}>
          Трафик
        </Title>
        <Text className={styles.chartSummary} size="sm" c="dimmed">
          {trafficSummary}
        </Text>
        <AreaChart
          aria-label="График просмотров и сессий"
          accessibilityLayer
          h={260}
          data={data.trafficSeries}
          dataKey="time"
          series={[
            { name: "pageviews", label: "Просмотры", color: "teal.5" },
            { name: "sessions", label: "Сессии", color: "cyan.5" },
          ]}
          curveType="linear"
          withLegend
        />
      </Card>
    </SimpleGrid>
  );
};

export default TelemetryCharts;
