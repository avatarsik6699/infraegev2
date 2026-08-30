export namespace LessonIntroTypes {
  export type Props = {
    accessTier: "free" | "paid";
    className?: string;
    eyebrow: React.ReactNode;
    summary: string;
    taskCount: number;
    technology: React.ReactNode;
    title: string;
  };
}
