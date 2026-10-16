export type ExamTopicDefinition = {
  id: string;
  taskNumbers: readonly [number, ...number[]];
  title: string;
  summary: string;
};

export const examTopicDefinitions: readonly ExamTopicDefinition[];
