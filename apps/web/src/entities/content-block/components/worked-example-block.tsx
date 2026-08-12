import { Paper, Stack } from "@mantine/core";
import type {
  WorkedExampleBlockType,
  WorkedExampleBlockData,
} from "~/entities/content";
import { Typography } from "~/shared/components/typography";

const HEADING: Record<string, string> = {
  worked_example: "Разобранный пример",
  completion_exercise: "Закончи решение",
  productive_failure_prompt: "Попробуй сам, пока не зная теории",
};

type Props = {
  type: WorkedExampleBlockType;
  data: WorkedExampleBlockData;
};

/** worked_example / completion_exercise / productive_failure_prompt share one shape (docs/SPEC.md
 * §3) — they differ only in pedagogical framing (learning-science-principles.md §1.1/§5), not
 * structure, so one component renders all three with a type-specific heading. */
export const WorkedExampleBlock: React.FC<Props> = (props) => {
  return (
    <Paper
      component="section"
      data-block-type={props.type}
      withBorder
      p="md"
      radius="sm"
    >
      <Stack gap="sm">
        <Typography.Title order={2}>
          {HEADING[props.type] ?? "Пример"}
        </Typography.Title>
        <Typography.Text>{props.data.prompt}</Typography.Text>
        {props.type === "worked_example" ? (
          <ol>
            {props.data.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        ) : (
          // completion_exercise / productive_failure_prompt: the steps are the model solution,
          // revealed only after an attempt — not shown up front (Kapur productive-failure framing).
          <details>
            <summary>Показать разбор</summary>
            <ol>
              {props.data.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </details>
        )}
      </Stack>
    </Paper>
  );
};
