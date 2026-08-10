import { Badge, Stack } from "@mantine/core";
import { useEffect, useSyncExternalStore } from "react";
import { ContentBlockList } from "~/entities/content-block";
import { PrerequisiteCallout } from "~/entities/content";
import { PracticeTaskWidget } from "~/features/check-answer";
import {
  getTopicProgressSnapshot,
  ProgressBar,
  recordCorrectTask,
  subscribeToProgress,
  type TopicProgress,
} from "~/features/track-progress";
import { PageContainer } from "~/shared/components/page-container";
import { Typography } from "~/shared/components/typography";
import { trackTopicView } from "~/shared/lib/analytics";
import styles from "./topic-page.module.css";
import type { TopicPageTypes } from "./topic-page.types";

export const TopicPage: React.FC<TopicPageTypes.Props> = (props) => {
  const taskIds = props.tasks.map((task) => task.id);
  const serverProgress: TopicProgress = {
    correctCount: 0,
    totalCount: new Set(taskIds).size,
    ratio: 0,
    mastered: false,
  };
  const progressSnapshot = useSyncExternalStore(
    subscribeToProgress,
    () => getTopicProgressSnapshot(props.topic.id, taskIds),
    () => JSON.stringify(serverProgress),
  );
  const progress = JSON.parse(progressSnapshot) as TopicProgress;

  useEffect(() => {
    trackTopicView(props.topic.id);
  }, [props.topic.id]);

  function handleCorrect(taskId: string) {
    recordCorrectTask(
      props.topic.id,
      taskId,
      taskIds,
      props.topic.mastery_threshold,
    );
  }

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
        <ProgressBar
          ratio={progress.ratio}
          label={`Прогресс по теме: ${progress.correctCount} из ${progress.totalCount} задач`}
        />
        <div role="status">
          <Typography.Text tone={progress.mastered ? "default" : "muted"}>
            {progress.mastered
              ? "Тема освоена"
              : `${progress.correctCount} из ${progress.totalCount} задач решено верно`}
          </Typography.Text>
        </div>
        {props.tasks.map((task, taskIndex) => (
          <PracticeTaskWidget
            key={task.id}
            task={task}
            analytics={{
              topicId: props.topic.id,
              taskIndex: taskIndex + 1,
              totalTasks: props.tasks.length,
            }}
            onCorrect={handleCorrect}
          />
        ))}

        <PrerequisiteCallout heading="Связанные темы:" links={props.related} />
      </Stack>
    </PageContainer>
  );
};
