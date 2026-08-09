import { ContentBlockList } from "~/entities/content-block/ui/content-block-list";
import type { ResolvedContentLink } from "~/entities/content/lib/content-link";
import type { Task, Topic } from "~/entities/content/model/types";
import { PrerequisiteCallout } from "~/entities/content/ui/prerequisite-callout";
import { PracticeTaskWidget } from "~/features/check-answer/ui/practice-task-widget";

type Props = {
  topic: Topic;
  tasks: Task[];
  prerequisites: ResolvedContentLink[];
  related: ResolvedContentLink[];
};

export const TopicPage: React.FC<Props> = (props) => {
  return (
    <main className="container">
      <span className="task-badge">№{props.topic.task_numbers[0]}</span>
      <h1>{props.topic.title}</h1>

      <PrerequisiteCallout
        heading="Эта тема легче даётся, если понимать:"
        links={props.prerequisites}
      />

      <ContentBlockList blocks={props.topic.content_blocks} />

      <h2>Практика</h2>
      {props.tasks.map((task) => (
        <PracticeTaskWidget key={task.id} task={task} />
      ))}

      <PrerequisiteCallout heading="Связанные темы:" links={props.related} />
    </main>
  );
};
