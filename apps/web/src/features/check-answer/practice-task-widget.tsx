import { Alert, Button, Paper, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useEffect, useRef } from "react";
import { ContentBlockList } from "~/entities/content-block";
import { Typography } from "~/shared/components/typography";
import {
  trackPracticeAnswer,
  trackPracticeStart,
} from "~/shared/lib/analytics";
import { answerFormSchema, type AnswerFormValues } from "./model/answer-form";
import { useCheckAnswer } from "./model/use-check-answer";
import type { PracticeTaskWidgetTypes } from "./practice-task-widget.types";

/**
 * Practice widget — `interaction_type: production` in priority over `recognition` (docs/SPEC.md
 * §5.2/§11.1): a free-text/number input, not a multiple-choice list, since production retrieval is
 * what the testing effect relies on (learning-science-principles.md §3.1). Progressively enhanced:
 * the statement/explanation are server-rendered; only "submit answer" needs JS.
 */
export const PracticeTaskWidget: React.FC<PracticeTaskWidgetTypes.Props> = (
  props,
) => {
  const answerInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<AnswerFormValues>({
    initialValues: { answer: "" },
    validate: zod4Resolver(answerFormSchema),
    validateInputOnBlur: true,
  });
  const checkAnswerMutation = useCheckAnswer();

  useEffect(() => {
    if (form.errors.answer || checkAnswerMutation.isError) {
      answerInputRef.current?.focus();
    }
  }, [checkAnswerMutation.isError, form.errors.answer]);

  async function handleSubmit(values: AnswerFormValues) {
    if (props.analytics) {
      trackPracticeStart(props.analytics.topicId, props.analytics.totalTasks);
    }
    checkAnswerMutation.reset();
    try {
      const body = await checkAnswerMutation.mutateAsync({
        taskId: props.task.id,
        answer: values.answer.trim(),
      });
      if (props.analytics) {
        trackPracticeAnswer(
          props.analytics.topicId,
          props.analytics.taskIndex,
          body.correct,
        );
      }
      if (body.correct) props.onCorrect?.(props.task.id);
    } catch {
      // The mutation owns the error state rendered below; expected request failures stay inline.
    }
  }

  return (
    <Paper
      component="form"
      onSubmit={form.onSubmit((values) => void handleSubmit(values))}
      withBorder
      p="md"
      radius="sm"
    >
      <Stack gap="sm">
        <Typography.Text>{props.task.statement}</Typography.Text>
        <TextInput
          label="Ответ"
          type="text"
          ref={answerInputRef}
          {...form.getInputProps("answer")}
          disabled={checkAnswerMutation.isPending}
        />
        <Button
          type="submit"
          loading={checkAnswerMutation.isPending}
          disabled={checkAnswerMutation.isPending}
        >
          Проверить
        </Button>

        {checkAnswerMutation.data && (
          <Alert
            role="status"
            data-correct={checkAnswerMutation.data.correct}
            color={checkAnswerMutation.data.correct ? "textbook" : "highlight"}
            variant="light"
          >
            <Typography.Text>
              {checkAnswerMutation.data.correct ? "Верно!" : "Неверно."}
            </Typography.Text>
            {/* Feedback timing/depth per learning-science-principles.md §6: correct/incorrect is
              immediate, but the explanation is a full worked-example-style breakdown, not just
              "the right answer is X" (docs/SPEC.md §3, Task.explanation). */}
            <ContentBlockList blocks={checkAnswerMutation.data.explanation} />
          </Alert>
        )}
        {checkAnswerMutation.isError && (
          <Alert role="alert" color="highlight" variant="light">
            Не удалось проверить ответ. Попробуйте ещё раз.
          </Alert>
        )}
      </Stack>
    </Paper>
  );
};
