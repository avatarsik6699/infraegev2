export namespace LessonTheoryTypes {
  export type Concept = {
    id: string;
    navLabel: string;
    /**
     * The lesson's opening paragraphs (Change 175): shown under the lesson
     * heading without a heading of their own and left out of «На этой
     * странице»; `navLabel` stays for theory links.
     */
    lead?: boolean;
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
