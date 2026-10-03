import { getPracticeTask } from "~/widgets/practice-task";

/** A short story task about recursion: solvable with a table of values, and it leads into topic 16. */
export const foundationFeaturedTask = {
  id: "0a2d167a-0895-4d5e-88b1-ad910bcc4f05",
  load: () => getPracticeTask({ data: "0a2d167a-0895-4d5e-88b1-ad910bcc4f05" }),
} as const;
