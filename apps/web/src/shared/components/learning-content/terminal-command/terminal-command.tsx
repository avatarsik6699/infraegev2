import { Check, Copy, SquareTerminal } from "lucide-react";
import { useState } from "react";
import { copyText } from "~/shared/lib/clipboard";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import styles from "./terminal-command.module.css";

type Props = {
  /** One command, typed after the prompt. */
  command: string;
  /** Whose terminal, when it matters: «Windows», «Linux и macOS». */
  system?: string;
};

/**
 * A command typed into the terminal (Change 197): not a code block, so it
 * does not look like one — a strip with a tag carrying the terminal mark (or
 * whose terminal it is), the prompt sign (not copied) and
 * the command on one line, with a copy button. Never dark: DESIGN.md rejects
 * terminal looks.
 */
export const TerminalCommand: React.FC<Props> = (props) => {
  const enhanced = useIsEnhanced();
  const [copied, setCopied] = useState<boolean | null>(null);
  const label = props.system
    ? `Команда в терминале · ${props.system}`
    : "Команда в терминале";
  let copyLabel = "Копировать команду";
  if (copied === true) copyLabel = "Команда скопирована";
  if (copied === false) copyLabel = "Не удалось скопировать";
  return (
    <div
      className={styles.root}
      role="group"
      aria-label={label}
      data-terminal-command
      data-learning-block
    >
      <span className={styles.tag} aria-hidden="true">
        <SquareTerminal size={15} strokeWidth={1.75} />
        {props.system ?? "Терминал"}
      </span>
      <span className={styles.prompt} aria-hidden="true">
        &gt;
      </span>
      <code className={styles.command}>{props.command}</code>
      {enhanced ? (
        <button
          className={styles.copy}
          type="button"
          aria-label={copyLabel}
          title={copyLabel}
          onClick={() => void copyText(props.command).then(setCopied)}
        >
          {copied ? (
            <Check aria-hidden="true" size={15} />
          ) : (
            <Copy aria-hidden="true" size={15} />
          )}
        </button>
      ) : null}
    </div>
  );
};
