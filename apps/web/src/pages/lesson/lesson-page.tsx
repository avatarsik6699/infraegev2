import { Alert, List, Stack } from "@mantine/core";
import { PracticeTaskWidget } from "~/features/check-answer";
import { Typography } from "~/shared/components/typography";
import { LearningPageShell } from "~/widgets/learning-page-shell";
import type { LessonPageTypes } from "./lesson-page.types";

export const LessonPage: React.FC<LessonPageTypes.Props> = (props) => {
  return (
    <LearningPageShell
      overline="Урок мини-курса"
      title={props.lesson.title}
      metadata={[{ label: `${props.tasks.length} задач` }]}
      sections={props.lesson.sections}
      quickReferenceBlocks={props.lesson.quick_reference_blocks}
      practice={
        <Stack gap="lg">
          <Typography.Title order={2}>Практика</Typography.Title>
          {props.tasks.map((task) => (
            <PracticeTaskWidget key={task.id} task={task} />
          ))}
        </Stack>
      }
      afterContent={
        props.unlocks.length > 0 ? (
          <Alert role="note" color="textbook" variant="light">
            <Typography.Text>Теперь ты готов к темам ЕГЭ:</Typography.Text>
            <List>
              {props.unlocks.map((link) => (
                <List.Item key={link.id}>{link.title}</List.Item>
              ))}
            </List>
          </Alert>
        ) : undefined
      }
    />
  );
};
