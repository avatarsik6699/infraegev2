/** A public task source as shown in the catalog and on the task page. */
export type PracticeSourceValue = {
  kind: string;
  title: string | null;
  author?: string | null;
  original_id?: string | null;
  url?: string | null;
  year: number | null;
};

export const practiceSource = {
  /** «Демоверсия 2023», never «Демоверсия 2023 · 2023». */
  label(source: PracticeSourceValue) {
    const title =
      source.title ??
      (source.kind === "original"
        ? "Авторская задача"
        : "Адаптированная задача");
    const year =
      source.year && !title.includes(String(source.year))
        ? ` · ${String(source.year)}`
        : "";
    const author = source.author ? ` · ${source.author}` : "";
    const number = source.original_id ? ` · № ${source.original_id}` : "";
    return `${title}${author}${year}${number}`;
  },
} as const;
