export namespace EmptyStateTypes {
  export type Props = {
    title: string;
    description: string;
    headingId?: string;
    headingOrder?: 1 | 2 | 3 | 4 | 5 | 6;
    action?: React.ReactNode;
  };
}
