import { codeBlockTokens } from "./code-block-tokens";
import styles from "./code-block.module.css";

type CodeBlockContentProps = {
  code: string;
  language: "python" | "text";
  showLineNumbers?: boolean;
};

export const CodeBlockContent: React.FC<CodeBlockContentProps> = (props) => {
  const lines = codeBlockTokens.create(props.code, props.language);

  return (
    <pre className={styles.scrollArea} data-code-scroll>
      <code className={styles.code} data-language={props.language}>
        {lines.map((line, lineIndex) => (
          <span className={styles.line} key={lineIndex}>
            {props.showLineNumbers ? (
              <span className={styles.lineNumber} aria-hidden="true">
                {lineIndex + 1}
              </span>
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
