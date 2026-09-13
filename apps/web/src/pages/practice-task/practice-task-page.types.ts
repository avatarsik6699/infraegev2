import type { getPracticeTask } from "./api/get-practice-task";
export namespace PracticeTaskPageTypes {
  export type Props = { result: Awaited<ReturnType<typeof getPracticeTask>> };
}
