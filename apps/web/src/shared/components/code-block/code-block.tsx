import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "~/shared/components/button";
import { Typography } from "~/shared/components/typography";
import { copyText } from "~/shared/lib/clipboard";
import { cssUtils } from "~/shared/lib/css-utils";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { CodeBlockContent } from "./code-block-content";
import type { CodeBlockTypes } from "./code-block.types";
import styles from "./code-block.module.css";

export const CodeBlock: React.FC<CodeBlockTypes.Props> = (props) => {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const enhanced = useIsEnhanced();
  const className = cssUtils.cx(styles.root, props.className);
  const isPython = props.language === "python";
  const copyLabel = getCopyLabel(copyState);
  const copyStatus = getCopyStatus(copyState);

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
              Python
            </Typography.Text>
          ) : null}
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
        {!enhanced || !copyStatus ? null : (
          <span className={styles.copyStatus} role="status" aria-live="polite">
            {copyStatus}
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

function getCopyLabel(copyState: "idle" | "copied" | "error"): string {
  if (copyState === "copied") return "Код скопирован";
  if (copyState === "error") return "Не удалось скопировать";
  return "Копировать код";
}

function getCopyStatus(copyState: "idle" | "copied" | "error"): string {
  if (copyState === "copied") return "Код скопирован в буфер обмена.";
  if (copyState === "error") {
    return "Не удалось скопировать код. Попробуйте ещё раз.";
  }
  return "";
}
