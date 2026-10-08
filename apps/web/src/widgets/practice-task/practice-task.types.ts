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
    /**
     * F48: false for a lesson-only task opened on its own page — the answer is
     * checked but not saved, since standalone progress counts catalog tasks only.
     */
    saveProgress?: boolean;
  };
}
