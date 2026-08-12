export namespace LearningPathTableOfContentsTypes {
  export type Item = {
    id: string;
    label: string;
    description: string;
  };

  export type Props = {
    items: Item[];
    targetSelector: string;
    offset?: number;
  };
}
