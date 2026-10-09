import { codeBlockTokens } from "./code-block-tokens";
import styles from "./code-block.module.css";

export type CodeBlockContentProps = {
  code: string;
  language: "python" | "text";
  showLineNumbers?: boolean;
  id?: string;
  collapsed?: boolean;
};

export const CodeBlockContent: React.FC<CodeBlockContentProps> = (props) => {
  const lines = codeBlockTokens.create(props.code, props.language);

  return (
    <pre
      className={styles.scrollArea}
      data-code-scroll
      data-collapsed={props.collapsed || undefined}
      id={props.id}
      tabIndex={0}
    >
      <code className={styles.code} data-language={props.language}>
        {lines.map((line, lineIndex) => (
          <span className={styles.line} key={lineIndex}>
            {props.showLineNumbers ? (
              // Decorative and barely visible (Change 171): the number is drawn
              // by CSS from data-line, so it is neither page text nor copied.
              <span
                className={styles.lineNumber}
                aria-hidden="true"
                data-line={lineIndex + 1}
              />
            ) : null}
            <span className={styles.lineContent}>
              {line.length === 0
                ? "\u00a0"
                : line.map((chunk, chunkIndex) =>
                    chunk.token ? (
                      <span
                        data-token={chunk.token}
                        key={`${lineIndex}-${chunkIndex}`}
                      >
                        {chunk.text}
                      </span>
                    ) : (
                      chunk.text
                    ),
                  )}
            </span>
          </span>
        ))}
      </code>
    </pre>
  );
};
