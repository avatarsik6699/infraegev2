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
  };
}
