export namespace CodeBlockTypes {
  export type Props = {
    code: string;
    language: "python" | "text";
    label: string;
    /**
     * Имя файла, чьи строки показаны (`23.txt`): стоит в шапке вместо
     * «Python», чтобы данные не читались как код (Change 172).
     */
    fileName?: string;
    /** Нумерация строк, как в редакторе; по умолчанию включена. */
    showLineNumbers?: boolean;
    className?: string;
    /**
     * Что печатает программа: под кодом в том же блоке, строки вывода через
     * «, » (Change 171).
     */
    output?: string;
  };
}
