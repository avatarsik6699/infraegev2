import type { Task } from "~/entities/content";

export namespace PracticeTaskWidgetTypes {
  export type Props = {
    task: Task;
    analytics?: {
      topicId: string;
      taskIndex: number;
      totalTasks: number;
    };
    onCorrect?: (taskId: string) => void;
  };
}
