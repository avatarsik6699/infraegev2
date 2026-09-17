import type { PracticeCatalogTypes } from "~/entities/practice-task";
import type { getPracticeTask } from "./api/get-practice-task";
export namespace PracticeTaskPageTypes {
  export type Props = {
    search: PracticeCatalogTypes.TaskSearch;
    result: Awaited<ReturnType<typeof getPracticeTask>>;
  };
}
