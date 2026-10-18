export namespace LessonIntroTypes {
  export type Props = {
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
    /** More meta after the counts, e.g. the exam level and minutes (Change 186). */
    examMeta?: readonly string[];
    /** Replaces the engineering grid with the page's own backdrop (Change 186). */
    backdrop?: React.ReactNode;
  };
}
