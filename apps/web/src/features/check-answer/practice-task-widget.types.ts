import type { Task } from "~/entities/content";

export namespace PracticeTaskWidgetTypes {
  export type Props = {
    task: Task;
    onMastered?: () => void;
  };
}
