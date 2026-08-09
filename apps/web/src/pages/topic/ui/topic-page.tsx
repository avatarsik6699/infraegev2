import { ContentBlockList } from "~/entities/content-block/ui/content-block-renderer";
import type { ResolvedContentLink } from "~/entities/content/lib/content-link";
import type { Task, Topic } from "~/entities/content/model/types";
import { PrerequisiteCallout } from "~/entities/content/ui/prerequisite-callout";
import { PracticeTaskWidget } from "~/features/check-answer/ui/practice-task-widget";

export function TopicPage({
  topic,
  tasks,
  prerequisites,
  related,
}: {
  topic: Topic;
  tasks: Task[];
  prerequisites: ResolvedContentLink[];
  related: ResolvedContentLink[];
}) {
  return (
    <main className="container">
      <span className="task-badge">№{topic.task_numbers[0]}</span>
      <h1>{topic.title}</h1>

      <PrerequisiteCallout
        heading="Эта тема легче даётся, если понимать:"
        links={prerequisites}
      />

      <ContentBlockList blocks={topic.content_blocks} />

      <h2>Практика</h2>
      {tasks.map((task) => (
        <PracticeTaskWidget key={task.id} task={task} />
      ))}

      <PrerequisiteCallout heading="Связанные темы:" links={related} />
    </main>
  );
}
