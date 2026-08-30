export namespace LessonTheoryTypes {
  export type Concept = {
    id: string;
    navLabel: string;
    explanation: React.ReactNode;
    diagram?: React.ReactNode;
    workedExample?: React.ReactNode;
    mistake?: React.ReactNode;
    checkpoint?: readonly {
      id: string;
      prompt: React.ReactNode;
      reveal: React.ReactNode;
    }[];
  };

  export type Props = {
    concepts: readonly Concept[];
    className?: string;
  };
}
