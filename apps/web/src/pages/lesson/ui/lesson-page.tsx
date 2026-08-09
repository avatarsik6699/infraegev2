import { ContentBlockList } from "~/entities/content-block/ui/content-block-renderer";
import type { ResolvedContentLink } from "~/entities/content/lib/content-link";
import type { CourseLesson, Task } from "~/entities/content/model/types";
import { PracticeTaskWidget } from "~/features/check-answer/ui/practice-task-widget";

export function LessonPage({
  lesson,
  tasks,
  unlocks,
}: {
  lesson: CourseLesson;
  tasks: Task[];
  unlocks: ResolvedContentLink[];
}) {
  return (
    <main className="container">
      <h1>{lesson.title}</h1>
      <ContentBlockList blocks={lesson.content_blocks} />

      <h2>Практика</h2>
      {tasks.map((task) => (
        <PracticeTaskWidget key={task.id} task={task} />
      ))}

      {unlocks.length > 0 && (
        <aside role="note">
          <p>Теперь ты готов к темам ЕГЭ:</p>
          <ul>
            {unlocks.map((link) => (
              <li key={link.id}>{link.title}</li>
            ))}
          </ul>
        </aside>
      )}
    </main>
  );
}
