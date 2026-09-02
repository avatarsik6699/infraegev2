import { Check, ChevronDown, Copy } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "~/shared/components/button";
import { Typography } from "~/shared/components/typography";
import { copyText } from "~/shared/lib/clipboard";
import { cssUtils } from "~/shared/lib/css-utils";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { CodeBlockContent } from "./code-block-content";
import type { CodeBlockTypes } from "./code-block.types";
import styles from "./code-block.module.css";

type CopyState = "idle" | "copied" | "error";

export const CodeBlock: React.FC<CodeBlockTypes.Props> = (props) => {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();
  const enhanced = useIsEnhanced();
  const className = cssUtils.cx(styles.root, props.className);
  const isPython = props.language === "python";
  const copyLabel = getCopyLabel(copyState);
  const copyStatus = getCopyStatus(copyState);
  const isLong = props.code.split("\n").length > 8;
  const collapsed = enhanced && isLong && !expanded;

  const handleCopy = async () => {
    const copied = await copyText(props.code);
    setCopyState(copied ? "copied" : "error");
  };

  return (
    <div
      className={className}
      role="group"
      aria-label={props.label}
      data-code-block-long={isLong || undefined}
    >
      <CodeBlockHeader
        copyLabel={copyLabel}
        copyState={copyState}
        copyStatus={copyStatus}
        enhanced={enhanced}
        isPython={isPython}
        onCopy={handleCopy}
      />
      <CodeBlockContent
        code={props.code}
        language={props.language}
        showLineNumbers={props.showLineNumbers}
        id={contentId}
        collapsed={collapsed}
      />
      {enhanced && isLong ? (
        <CodeBlockDisclosure
          collapsed={collapsed}
          contentId={contentId}
          onToggle={() => setExpanded((current) => !current)}
        />
      ) : null}
    </div>
  );
};

type CodeBlockHeaderProps = {
  copyLabel: string;
  copyState: CopyState;
  copyStatus: string;
  enhanced: boolean;
  isPython: boolean;
  onCopy: () => Promise<void>;
};

const CodeBlockHeader: React.FC<CodeBlockHeaderProps> = (props) => (
  <div className={styles.header}>
    <div className={styles.meta} aria-hidden="true">
      {props.isPython ? (
        <Typography.Text component="span" className={styles.language}>
          Python
        </Typography.Text>
      ) : null}
    </div>
    {props.enhanced ? (
      <Button
        className={styles.copyButton}
        density="compact"
        hierarchy="quiet"
        iconOnly
        iconStart={
          props.copyState === "copied" ? (
            <Check aria-hidden="true" size={14} />
          ) : (
            <Copy aria-hidden="true" size={14} />
          )
        }
        aria-label={props.copyLabel}
        title={props.copyLabel}
        type="button"
        onClick={() => void props.onCopy()}
      >
        {props.copyLabel}
      </Button>
    ) : null}
    {!props.enhanced || !props.copyStatus ? null : (
      <span className={styles.copyStatus} role="status" aria-live="polite">
        {props.copyStatus}
      </span>
    )}
  </div>
);

type CodeBlockDisclosureProps = {
  collapsed: boolean;
  contentId: string;
  onToggle: () => void;
};

const CodeBlockDisclosure: React.FC<CodeBlockDisclosureProps> = (props) => (
  <div
    className={styles.disclosure}
    data-collapsed={props.collapsed || undefined}
  >
    <Button
      className={styles.disclosureButton}
      density="compact"
      hierarchy="quiet"
      iconStart={
        <ChevronDown
          className={styles.disclosureIcon}
          aria-hidden="true"
          size={15}
          strokeWidth={1.75}
        />
      }
      type="button"
      aria-controls={props.contentId}
      aria-expanded={!props.collapsed}
      onClick={props.onToggle}
    >
      {props.collapsed ? "Показать весь код" : "Свернуть код"}
    </Button>
  </div>
);

function getCopyLabel(copyState: CopyState): string {
  if (copyState === "copied") return "Код скопирован";
  if (copyState === "error") return "Не удалось скопировать";
  return "Копировать код";
}

function getCopyStatus(copyState: CopyState): string {
  if (copyState === "copied") return "Код скопирован в буфер обмена.";
  if (copyState === "error") {
    return "Не удалось скопировать код. Попробуйте ещё раз.";
  }
  return "";
}
