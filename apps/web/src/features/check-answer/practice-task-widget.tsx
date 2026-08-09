import { Alert, Button, Paper, Stack, TextInput } from "@mantine/core";
import { useState } from "react";
import { ContentBlockList } from "~/entities/content-block";
import { Typography } from "~/shared/components/typography";
import {
  checkAnswer,
  type CheckAnswerResponse,
} from "./api/check-answer";
import type { PracticeTaskWidgetTypes } from "./practice-task-widget.types";

/**
 * Practice widget — `interaction_type: production` in priority over `recognition` (docs/SPEC.md
 * §5.2/§11.1): a free-text/number input, not a multiple-choice list, since production retrieval is
 * what the testing effect relies on (learning-science-principles.md §3.1). Progressively enhanced:
 * the statement/explanation are server-rendered; only "submit answer" needs JS.
 */
export const PracticeTaskWidget: React.FC<PracticeTaskWidgetTypes.Props> = (props) => {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<CheckAnswerResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const body = await checkAnswer(props.task.id, answer);
      setResult(body);
      if (body.correct) props.onMastered?.();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Paper component="form" onSubmit={handleSubmit} withBorder p="md" radius="sm">
      <Stack gap="sm">
        <Typography.Text>{props.task.statement}</Typography.Text>
        <TextInput
          label="Ответ"
          type="text"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          disabled={submitting}
        />
        <Button
          type="submit"
          loading={submitting}
          disabled={answer.trim() === ""}
        >
          Проверить
        </Button>

        {result && (
          <Alert
            role="status"
            data-correct={result.correct}
            color={result.correct ? "textbook" : "highlight"}
            variant="light"
          >
            <Typography.Text>
              {result.correct ? "Верно!" : "Неверно."}
            </Typography.Text>
            {/* Feedback timing/depth per learning-science-principles.md §6: correct/incorrect is
              immediate, but the explanation is a full worked-example-style breakdown, not just
              "the right answer is X" (docs/SPEC.md §3, Task.explanation). */}
            <ContentBlockList blocks={result.explanation} />
          </Alert>
        )}
      </Stack>
    </Paper>
  );
};
