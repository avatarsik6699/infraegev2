import type { CourseProgressTypes } from "~/entities/course";

type Snapshots = Readonly<Record<string, { solvedTaskIds: readonly string[] }>>;

export namespace AccountDashboardTypes {
  export type CourseLesson = CourseProgressTypes.Lesson & {
    title: string;
    routeSlug: string;
  };

  export type Topic = {
    id: string;
    title: string;
    routeSlug: string;
    taskLabel: string;
    tasks: CourseProgressTypes.Lesson["tasks"];
  };

  /** Whether a source can be shown; `saved` lists lessons with any saved result. */
  export type Source = { ready: boolean };

  export type Input = {
    courseTitle?: string;
    courseRouteSlug?: string;
    courseLessons: readonly CourseLesson[];
    topics: readonly Topic[];
    /** Current-revision results for lessons whose summaries are loaded. */
    progress: Snapshots;
    /** Raw saved results, used when a summary is unavailable. */
    saved: Snapshots;
    course: Source;
    topicsSource: Source;
    practice: Source & { saved: number };
  };

  export type TopicRow = {
    id: string;
    title: string;
    routeSlug: string;
    taskLabel: string;
    solved: number;
    total: number;
  };

  export type Step =
    | {
        kind: "course";
        title: string;
        description: string;
        courseRouteSlug: string;
        /** Omitted when the course summary is unavailable: link to the overview. */
        lessonRouteSlug?: string;
        action: string;
      }
    | {
        kind: "topic";
        title: string;
        description: string;
        routeSlug: string;
        action: string;
      }
    | { kind: "practice"; title: string; description: string; action: string }
    | { kind: "start"; title: string; description: string; action: string };

  export type Dashboard = {
    course?: { mastered: number; total: number };
    topics?: {
      rows: TopicRow[];
      solved: number;
      total: number;
      started: number;
    };
    practice?: { saved: number };
    nextStep?: Step;
    continuations: Step[];
  };
}
