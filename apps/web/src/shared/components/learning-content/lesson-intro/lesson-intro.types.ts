export namespace LessonIntroTypes {
  export type Props = {
    accessTier: "free" | "paid";
    className?: string;
    /** The exam tasks of the topic: «Задание 3». */
    eyebrow: React.ReactNode;
    /** Subtopics of the topic, when the head opens its first page. */
    subtopicCount?: number;
    summary: string;
    taskCount?: number;
    /** Tasks outside mastery, named after the main count (F8). */
    additionalTaskCount?: number;
    title: string;
  };
}
