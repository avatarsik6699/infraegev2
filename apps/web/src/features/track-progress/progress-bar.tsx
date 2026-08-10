import { Progress, Stack } from "@mantine/core";
import { Typography } from "~/shared/components/typography";
import type { ProgressBarTypes } from "./progress-bar.types";

export const ProgressBar: React.FC<ProgressBarTypes.Props> = (props) => {
  const percent = Math.round(props.ratio * 100);
  return (
    <Stack gap="xs">
      <Progress
        value={percent}
        aria-label={props.label ?? "Прогресс освоения"}
      />
      <Typography.Text component="span" size="sm" tone="muted">
        {percent}%
      </Typography.Text>
    </Stack>
  );
};
