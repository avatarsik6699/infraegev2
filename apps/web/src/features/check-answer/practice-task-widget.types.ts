import type { Task } from "~/entities/content";

export namespace PracticeTaskWidgetTypes {
  export type Props = {
    task: Task;
    onCorrect?: (taskId: string) => void;
  };
}
