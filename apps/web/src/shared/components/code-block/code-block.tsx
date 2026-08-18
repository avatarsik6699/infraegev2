import { Check, Copy } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { Button } from "~/shared/components/button";
import { Typography } from "~/shared/components/typography";
import { copyText } from "~/shared/lib/clipboard";
import { cssUtils } from "~/shared/lib/css-utils";
import { enhancementState } from "~/shared/lib/enhancement-state";
import { CodeBlockContent } from "./code-block-content";
import type { CodeBlockTypes } from "./code-block.types";
import styles from "./code-block.module.css";

export const CodeBlock: React.FC<CodeBlockTypes.Props> = (props) => {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const enhanced = useSyncExternalStore(
    enhancementState.subscribe,
    enhancementState.getClientSnapshot,
    enhancementState.getServerSnapshot,
  );
  const className = cssUtils.cx(styles.root, props.className);
  const isPython = props.language === "python";
  const kind = isPython ? "пример" : "запись";
  const copyLabel =
    copyState === "copied"
      ? "Код скопирован"
      : copyState === "error"
        ? "Не удалось скопировать"
        : "Копировать код";

  const handleCopy = async () => {
    const copied = await copyText(props.code);
    setCopyState(copied ? "copied" : "error");
  };

  return (
    <div className={className} role="group" aria-label={props.label}>
      <div className={styles.header}>
        <div className={styles.meta} aria-hidden="true">
          {isPython ? (
            <Typography.Text component="span" className={styles.language}>
              {props.language}
            </Typography.Text>
          ) : null}
          <Typography.Text component="span" className={styles.kind}>
            {kind}
          </Typography.Text>
        </div>
        {enhanced ? (
          <Button
            className={styles.copyButton}
            density="compact"
            hierarchy="quiet"
            iconStart={
              copyState === "copied" ? (
                <Check aria-hidden="true" size={14} />
              ) : (
                <Copy aria-hidden="true" size={14} />
              )
            }
            type="button"
            onClick={() => void handleCopy()}
          >
            {copyLabel}
          </Button>
        ) : null}
        {!enhanced || copyState === "idle" ? null : (
          <span className={styles.copyStatus} role="status" aria-live="polite">
            {copyState === "copied"
              ? "Код скопирован в буфер обмена."
              : "Не удалось скопировать код. Попробуйте ещё раз."}
          </span>
        )}
      </div>
      <CodeBlockContent
        code={props.code}
        language={props.language}
        showLineNumbers={props.showLineNumbers}
      />
    </div>
  );
};
