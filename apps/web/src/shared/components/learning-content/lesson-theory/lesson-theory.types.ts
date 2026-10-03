export namespace LessonTheoryTypes {
  export type Concept = {
    id: string;
    navLabel: string;
    explanation: React.ReactNode;
    diagram?: React.ReactNode;
    workedExample?: React.ReactNode;
    mistake?: React.ReactNode;
  };

  export type Props = {
    concepts: readonly Concept[];
    className?: string;
    /** `page`: concepts of one subtopic page without the «Теория» heading (Change 167). */
    variant?: "lesson" | "page";
    /** Concept heading level in the `page` variant. Defaults to 3. */
    conceptHeadingOrder?: 2 | 3;
  };
}
