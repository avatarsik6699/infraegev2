import { ChevronDown, SquareTerminal } from "lucide-react";
import { Fragment, useId, useState } from "react";
import { Button } from "~/shared/components/button";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { CodeBlockLabel } from "./code-block-label";
import styles from "./code-block.module.css";

export type CodeBlockOutputProps = {
  /** Printed text, line by line; typed input is marked `⟪…⟫`. */
  text: string;
  error?: string;
  collapsible?: boolean;
  /** Shown instead of an empty output (step-by-step run before any print). */
  emptyText?: string;
  live?: boolean;
};

const TYPED = /⟪(.*?)⟫/gu;
const FOLD_LINES = 8;

/** One line of terminal output: typed input becomes a key-like chip with ↵. */
const OutputLine: React.FC<{ line: string }> = (props) => {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of props.line.matchAll(TYPED)) {
    const index = match.index;
    parts.push(props.line.slice(last, index));
    parts.push(
      <kbd className={styles.typed} key={index}>
        {match[1]}
        <span className={styles.enter} aria-label="Enter">
          ↵
        </span>
      </kbd>,
    );
    last = index + match[0].length;
  }
  parts.push(props.line.slice(last));
  return <>{parts}</>;
};

export const CodeBlockOutput: React.FC<CodeBlockOutputProps> = (props) => {
  const enhanced = useIsEnhanced();
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();
  const text = props.text.replace(/\n+$/u, "");

  const lines = text ? text.split("\n") : [];
  const errorLines = props.error ? props.error.split("\n") : [];
  const isLong =
    (props.collapsible ?? true) &&
    lines.length + errorLines.length > FOLD_LINES;
  const collapsed = enhanced && isLong && !expanded;

  return (
    <div className={styles.output} data-code-output>
      <CodeBlockLabel icon={SquareTerminal}>Вывод:</CodeBlockLabel>
      <div className={styles.outputBody}>
        <samp
          className={styles.outputLines}
          id={contentId}
          data-collapsed={collapsed || undefined}
          aria-live={props.live ? "polite" : undefined}
        >
          {lines.length === 0 && errorLines.length === 0 ? (
            <span className={styles.outputEmpty}>{props.emptyText ?? ""}</span>
          ) : null}
          {lines.map((line, index) => (
            <Fragment key={index}>
              {index > 0 ? "\n" : null}
              <OutputLine line={line} />
            </Fragment>
          ))}
          {errorLines.length > 0 ? (
            <>
              {lines.length > 0 ? "\n" : null}
              <span className={styles.outputError} data-code-error>
                {errorLines.join("\n")}
              </span>
            </>
          ) : null}
        </samp>
        {enhanced && isLong ? (
          <Button
            className={styles.outputDisclosure}
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
            aria-controls={contentId}
            aria-expanded={!collapsed}
            onClick={() => setExpanded((current) => !current)}
          >
            {collapsed ? "Показать весь вывод" : "Свернуть вывод"}
          </Button>
        ) : null}
      </div>
    </div>
  );
};
