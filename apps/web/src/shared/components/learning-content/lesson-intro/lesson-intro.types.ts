export namespace LessonIntroTypes {
  export type Props = {
    presentation?: "default" | "study";
    accessTier: "free" | "paid";
    className?: string;
    eyebrow: React.ReactNode;
    summary: string;
    taskCount: number;
    technology: React.ReactNode;
    title: string;
  };
}
