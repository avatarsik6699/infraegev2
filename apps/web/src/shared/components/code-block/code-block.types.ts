export namespace CodeBlockTypes {
  export type Props = {
    code: string;
    language: "python" | "text";
    label: string;
    /** Нумерация строк, как в редакторе; по умолчанию включена. */
    showLineNumbers?: boolean;
    className?: string;
  };
}
