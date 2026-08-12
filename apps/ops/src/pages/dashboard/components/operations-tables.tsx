import { Card, ScrollArea, SimpleGrid, Table, Title } from "@mantine/core";
import type { DashboardData } from "../../../../contracts/index";

const EmptyRow: React.FC<{ columns: number; children: React.ReactNode }> = (
  props,
) => (
  <Table.Tr>
    <Table.Td colSpan={props.columns}>{props.children}</Table.Td>
  </Table.Tr>
);

export const formatContainerMemory = (memoryMiB: number): string => {
  const value = memoryMiB >= 1024 ? memoryMiB / 1024 : memoryMiB;
  const unit = memoryMiB >= 1024 ? "GiB" : "MiB";
  const formatted = value
    .toFixed(2)
    .replace(/\.00$/, "")
    .replace(/(\.\d)0$/, "$1");

  return `${formatted} ${unit}`;
};

const ContainersTable: React.FC<{ rows: DashboardData["containers"] }> = ({
  rows,
}) => (
  <Card withBorder radius="sm">
    <Title order={2}>Контейнеры</Title>
    <ScrollArea>
      <Table striped highlightOnHover>
        <Table.Caption>
          Состояние и потребление ресурсов контейнерами
        </Table.Caption>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Сервис</Table.Th>
            <Table.Th>Статус</Table.Th>
            <Table.Th>CPU</Table.Th>
            <Table.Th>RAM</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.length === 0 ? (
            <EmptyRow columns={4}>Данные о контейнерах отсутствуют</EmptyRow>
          ) : (
            rows.map((item) => (
              <Table.Tr key={item.name}>
                <Table.Td>{item.name}</Table.Td>
                <Table.Td>{item.status}</Table.Td>
                <Table.Td>{item.cpu}%</Table.Td>
                <Table.Td>{formatContainerMemory(item.memoryMiB)}</Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  </Card>
);

const FunnelTable: React.FC<{ rows: DashboardData["funnel"] }> = ({ rows }) => (
  <Card withBorder radius="sm">
    <Title order={2}>Учебная воронка</Title>
    <Table>
      <Table.Caption>
        Количество учебных событий за выбранный период
      </Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Шаг</Table.Th>
          <Table.Th>События</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rows.length === 0 ? (
          <EmptyRow columns={2}>Учебных событий пока нет</EmptyRow>
        ) : (
          rows.map((item) => (
            <Table.Tr key={item.step}>
              <Table.Td>{item.step}</Table.Td>
              <Table.Td>{item.total}</Table.Td>
            </Table.Tr>
          ))
        )}
      </Table.Tbody>
    </Table>
  </Card>
);

export const OperationsTables: React.FC<{ data: DashboardData }> = ({
  data,
}) => (
  <SimpleGrid cols={{ base: 1, lg: 2 }}>
    <ContainersTable rows={data.containers} />
    <FunnelTable rows={data.funnel} />
  </SimpleGrid>
);
