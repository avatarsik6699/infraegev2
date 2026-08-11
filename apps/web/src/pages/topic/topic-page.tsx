import { Stack } from "@mantine/core";
import { useEffect, useSyncExternalStore } from "react";
import { PrerequisiteCallout } from "~/entities/content";
import { PracticeTaskWidget } from "~/features/check-answer";
import {
  getTopicProgressSnapshot,
  ProgressBar,
  recordCorrectTask,
  subscribeToProgress,
  type TopicProgress,
} from "~/features/track-progress";
import { Typography } from "~/shared/components/typography";
import { trackTopicView } from "~/shared/lib/analytics";
import { LearningPageShell } from "~/widgets/learning-page-shell";
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

  useEffect(function trackTopicViewFx() {
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

  const progressLabel = `Прогресс по теме: ${progress.correctCount} из ${progress.totalCount} задач`;

  return (
    <LearningPageShell
      overline={`Задание №${props.topic.task_numbers[0]} · теория и практика`}
      title={props.topic.title}
      summary={props.topic.summary}
      metadata={[
        { label: `${props.tasks.length} задач` },
        { label: `порог ${Math.round(props.topic.mastery_threshold * 100)}%` },
      ]}
      sections={props.topic.sections}
      quickReferenceBlocks={props.topic.quick_reference_blocks}
      beforeContent={
        <PrerequisiteCallout
          heading="Эта тема легче даётся, если понимать:"
          links={props.prerequisites}
        />
      }
      progress={<ProgressBar ratio={progress.ratio} label={progressLabel} />}
      practice={
        <Stack gap="lg">
          <Typography.Title order={2}>Практика</Typography.Title>
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
        </Stack>
      }
      afterContent={
        <PrerequisiteCallout heading="Связанные темы:" links={props.related} />
      }
    />
  );
};
