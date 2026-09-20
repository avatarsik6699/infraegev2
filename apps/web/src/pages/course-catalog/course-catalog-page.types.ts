import type { CourseProgressTypes } from "~/entities/course";

export namespace CourseCatalogPageTypes {
  export type Props = {
    summaries: Record<string, readonly CourseProgressTypes.Lesson[] | null>;
  };

  export type Progress =
    | { status: "loading" }
    | { status: "unavailable" }
    | { status: "ready"; mastered: number; total: number };
}
