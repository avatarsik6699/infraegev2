export namespace LessonFigureTypes {
  export type Props = {
    /** Путь к рисунку (WebP из `docs/artifacts/lesson-media`). */
    src: string;
    width: number;
    height: number;
    /** Краткое имя рисунка для скринридера; суть идеи — в `caption`. */
    alt: string;
    /** Единственная подпись под рисунком: суть идеи и числа рисунка. */
    caption: React.ReactNode;
    className?: string;
  };
}
