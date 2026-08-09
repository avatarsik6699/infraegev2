import { ContentBlockList } from "~/entities/content-block/ui/content-block-list";
import type { ResolvedContentLink } from "~/entities/content/lib/content-link";
import type { CourseLesson, Task } from "~/entities/content/model/types";
import { PracticeTaskWidget } from "~/features/check-answer/ui/practice-task-widget";

type Props = {
  lesson: CourseLesson;
  tasks: Task[];
  unlocks: ResolvedContentLink[];
};

export const LessonPage: React.FC<Props> = (props) => {
  return (
    <main className="container">
      <h1>{props.lesson.title}</h1>
      <ContentBlockList blocks={props.lesson.content_blocks} />

      <h2>Практика</h2>
      {props.tasks.map((task) => (
        <PracticeTaskWidget key={task.id} task={task} />
      ))}

      {props.unlocks.length > 0 && (
        <aside role="note">
          <p>Теперь ты готов к темам ЕГЭ:</p>
          <ul>
            {props.unlocks.map((link) => (
              <li key={link.id}>{link.title}</li>
            ))}
          </ul>
        </aside>
      )}
    </main>
  );
};
