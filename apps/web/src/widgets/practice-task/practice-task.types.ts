import type { PracticeTaskTypes } from "~/entities/practice-task";
import type { getPracticeTask } from "./api/get-practice-task";
export namespace PracticeTaskWidgetTypes {
  export type Result = Awaited<ReturnType<typeof getPracticeTask>>;
  export type Props = {
    task: PracticeTaskTypes.Task;
    links: Result["links"];
    onRefresh: () => Promise<unknown>;
    active?: boolean;
    topicHeading?: string;
    presentation?: "catalog" | "detail";
  };
}
