export namespace CodeBlockTypes {
  export type Props = {
    code: string;
    language: "python" | "text";
    label: string;
    /**
     * Подпись шапки вместо «Python»: имя файла, чьи строки показаны
     * (`23.txt`, Change 172), условное имя программы курса (`level.py`) или
     * «команда» у команд терминала (Change 175).
     */
    fileName?: string;
    /** Нумерация строк, как в редакторе; по умолчанию включена. */
    showLineNumbers?: boolean;
    className?: string;
    /**
     * Что печатает программа, под кодом в том же блоке. В темах — одной
     * строкой через «, » (Change 171); в курсе (`outputLayout="lines"`) —
     * строками, как в терминале, а набранный ввод помечен `⟪…⟫` и показан
     * «клавишей» с ↵ (Change 175).
     */
    output?: string;
    outputLayout?: "row" | "lines";
    /** Сообщение об ошибке, которым остановилась программа: последним в «Выводе». */
    error?: string;
    /** Кнопки шапки справа (запуск по шагам). */
    headerActions?: React.ReactNode;
    /** Подсвеченная строка кода (с 1) и её вид: выполненная или с ошибкой. */
    activeLine?: number;
    activeLineTone?: "current" | "error";
    /** Панель рядом с кодом (или под ним на узком экране). */
    codeAside?: React.ReactNode;
    /** Содержимое под кодом вместо статичного вывода (пошаговый запуск). */
    footer?: React.ReactNode;
    /** Сворачивать длинный код и вывод; при пошаговом запуске выключено. */
    collapsible?: boolean;
  };
}
