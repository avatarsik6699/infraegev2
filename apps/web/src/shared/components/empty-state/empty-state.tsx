import { Paper, Stack } from "@mantine/core";
import { Typography } from "~/shared/components/typography";

type Props = {
  title: string;
  description: string;
};

export const EmptyState: React.FC<Props> = (props) => (
  <Paper component="section" withBorder p="xl" radius="sm">
    <Stack gap="xs">
      <Typography.Title order={2}>{props.title}</Typography.Title>
      <Typography.Text tone="muted">{props.description}</Typography.Text>
    </Stack>
  </Paper>
);
