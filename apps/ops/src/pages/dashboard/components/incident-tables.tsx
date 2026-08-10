import { Card, Table, Title } from "@mantine/core";
import type { DashboardData } from "../../../../contracts/index";

const EmptyRow: React.FC<{ columns: number; children: React.ReactNode }> = (props) => (
  <Table.Tr>
    <Table.Td colSpan={props.columns}>{props.children}</Table.Td>
  </Table.Tr>
);

const ErrorTable: React.FC<{ rows: DashboardData["errors"] }> = ({ rows }) => (
  <Card withBorder radius="sm">
    <Title order={2}>Последние ошибки</Title>
    <Table>
      <Table.Caption>Последние ошибки приложений и системных служб</Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Время</Table.Th>
          <Table.Th>Сервис</Table.Th>
          <Table.Th>Сообщение</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rows.length === 0 ? (
          <EmptyRow columns={3}>Ошибок за доступный период нет</EmptyRow>
        ) : (
          rows.map((item, index) => (
            <Table.Tr key={`${item.time}-${item.service}-${index}`}>
              <Table.Td>{item.time}</Table.Td>
              <Table.Td>{item.service}</Table.Td>
              <Table.Td>{item.message}</Table.Td>
            </Table.Tr>
          ))
        )}
      </Table.Tbody>
    </Table>
  </Card>
);

const Fail2banTable: React.FC<{ rows: DashboardData["bans"] }> = ({ rows }) => (
  <Card withBorder radius="sm">
    <Title order={2}>fail2ban</Title>
    <Table>
      <Table.Caption>Активные блокировки по fail2ban jail</Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Jail</Table.Th>
          <Table.Th>Банов</Table.Th>
          <Table.Th>Адреса</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rows.length === 0 ? (
          <EmptyRow columns={3}>Активных блокировок нет</EmptyRow>
        ) : (
          rows.map((item) => (
            <Table.Tr key={item.jail}>
              <Table.Td>{item.jail}</Table.Td>
              <Table.Td>{item.count}</Table.Td>
              <Table.Td>{item.addresses.join(", ") || "—"}</Table.Td>
            </Table.Tr>
          ))
        )}
      </Table.Tbody>
    </Table>
  </Card>
);

export const IncidentTables: React.FC<{ data: DashboardData }> = ({ data }) => (
  <>
    <ErrorTable rows={data.errors} />
    <Fail2banTable rows={data.bans} />
  </>
);
