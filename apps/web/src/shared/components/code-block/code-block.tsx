import { Check, ChevronDown, Copy, FileCode2, FileText } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "~/shared/components/button";
import { Typography } from "~/shared/components/typography";
import { copyText } from "~/shared/lib/clipboard";
import { cssUtils } from "~/shared/lib/css-utils";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { CodeBlockContent } from "./code-block-content";
import { CodeBlockOutput } from "./code-block-output";
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
  const collapsible = props.collapsible ?? true;
  const isLong = props.code.split("\n").length > 8;
  const collapsed = enhanced && collapsible && isLong && !expanded;

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
      data-learning-block
      data-code-aside={props.codeAside ? true : undefined}
    >
      <CodeBlockHeader
        copyLabel={copyLabel}
        copyState={copyState}
        copyStatus={copyStatus}
        enhanced={enhanced}
        isPython={isPython}
        fileName={props.fileName}
        actions={props.headerActions}
        onCopy={handleCopy}
      />
      <div className={styles.body} data-code-body>
        <CodeBlockContent
          code={props.code}
          language={props.language}
          showLineNumbers={isPython}
          id={contentId}
          collapsed={collapsed}
          activeLine={props.activeLine}
          activeLineTone={props.activeLineTone}
        />
        {enhanced && collapsible && isLong ? (
          // inside the code area: the fade and the button sit at the bottom
          // of the code, never over the output under it
          <CodeBlockDisclosure
            collapsed={collapsed}
            contentId={contentId}
            onToggle={() => setExpanded((current) => !current)}
          />
        ) : null}
        {props.codeAside}
      </div>
      {props.footer ??
        (props.output === undefined && props.error === undefined ? null : (
          <CodeBlockOutput
            text={props.output ?? ""}
            error={props.error}
            collapsible={collapsible}
          />
        ))}
    </div>
  );
};

type CodeBlockHeaderProps = {
  copyLabel: string;
  copyState: CopyState;
  copyStatus: string;
  enhanced: boolean;
  isPython: boolean;
  fileName?: string;
  actions?: React.ReactNode;
  onCopy: () => Promise<void>;
};

const CodeBlockHeader: React.FC<CodeBlockHeaderProps> = (props) => (
  <div className={styles.header}>
    <div className={styles.meta} aria-hidden="true">
      {props.isPython || props.fileName ? (
        <Typography.Text component="span" className={styles.language}>
          <FileIcon isPython={props.isPython} fileName={props.fileName} />
          <span className={styles.languageName}>
            {props.fileName ?? "Python"}
          </span>
        </Typography.Text>
      ) : null}
    </div>
    {props.enhanced ? (
      <Button
        surface="code"
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
    {props.actions ? (
      <div className={styles.actions}>{props.actions}</div>
    ) : null}
    {!props.enhanced || !props.copyStatus ? null : (
      <span className={styles.copyStatus} role="status" aria-live="polite">
        {props.copyStatus}
      </span>
    )}
  </div>
);

/** The name's mark: a Python program or a data file. */
const FileIcon: React.FC<{ isPython: boolean; fileName?: string }> = (
  props,
) => {
  const Icon = props.isPython ? FileCode2 : FileText;
  return (
    <Icon
      className={styles.languageIcon}
      aria-hidden="true"
      size={14}
      strokeWidth={1.75}
    />
  );
};

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
      surface="code"
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
