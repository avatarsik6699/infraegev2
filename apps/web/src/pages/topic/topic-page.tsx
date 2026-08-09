import { Badge, Stack } from "@mantine/core";
import { ContentBlockList } from "~/entities/content-block";
import { PrerequisiteCallout } from "~/entities/content";
import { PracticeTaskWidget } from "~/features/check-answer";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import styles from "./topic-page.module.css";
import type { TopicPageTypes } from "./topic-page.types";

export const TopicPage: React.FC<TopicPageTypes.Props> = (props) => {
  return (
    <PageContainer>
      <Stack gap="lg">
        <Badge variant="outline" className={styles.taskBadge}>
          №{props.topic.task_numbers[0]}
        </Badge>
        <Typography.Title order={1}>{props.topic.title}</Typography.Title>

        <PrerequisiteCallout
          heading="Эта тема легче даётся, если понимать:"
          links={props.prerequisites}
        />

        <ContentBlockList blocks={props.topic.content_blocks} />

        <Typography.Title order={2}>Практика</Typography.Title>
        {props.tasks.map((task) => (
          <PracticeTaskWidget key={task.id} task={task} />
        ))}

        <PrerequisiteCallout heading="Связанные темы:" links={props.related} />
      </Stack>
    </PageContainer>
  );
};
