import { Alert, List, Stack } from "@mantine/core";
import { ContentBlockList } from "~/entities/content-block";
import { PracticeTaskWidget } from "~/features/check-answer";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import type { LessonPageTypes } from "./lesson-page.types";

export const LessonPage: React.FC<LessonPageTypes.Props> = (props) => {
  return (
    <PageContainer>
      <Stack gap="lg">
        <Typography.Title order={1}>{props.lesson.title}</Typography.Title>
        <ContentBlockList blocks={props.lesson.content_blocks} />

        <Typography.Title order={2}>Практика</Typography.Title>
        {props.tasks.map((task) => (
          <PracticeTaskWidget key={task.id} task={task} />
        ))}

        {props.unlocks.length > 0 && (
          <Alert role="note" color="textbook" variant="light">
            <Typography.Text>Теперь ты готов к темам ЕГЭ:</Typography.Text>
            <List>
              {props.unlocks.map((link) => (
                <List.Item key={link.id}>{link.title}</List.Item>
              ))}
            </List>
          </Alert>
        )}
      </Stack>
    </PageContainer>
  );
};
