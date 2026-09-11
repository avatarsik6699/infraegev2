export namespace LearningVisualFrameTypes {
  export type Props = {
    children: React.ReactNode;
    caption: string;
    captionPosition?: "before" | "after";
    purpose?: string;
    accessibleDescription?: React.ReactNode;
    className?: string;
  };
}
