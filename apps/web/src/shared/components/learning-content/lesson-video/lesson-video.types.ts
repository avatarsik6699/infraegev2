export namespace LessonVideoTypes {
  export type Props = {
    /** Путь к ролику без расширения: компонент подставит `.webm` и `.mp4`. */
    src: string;
    /** Постер: итоговый кадр, читается без движения. */
    poster: string;
    width: number;
    height: number;
    /** Краткое имя ролика для скринридера: входит в названия кнопки и полосы времени. */
    alt: string;
    /** Единственная подпись под роликом: суть идеи, она же текстовый эквивалент. */
    caption: React.ReactNode;
    className?: string;
  };
}
