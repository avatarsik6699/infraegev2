import { CodeHighlight } from "@mantine/code-highlight";
import { Typography } from "~/shared/components/typography";
import type { CodeBlockTypes } from "./code-block.types";
import styles from "./code-block.module.css";

export const CodeBlock: React.FC<CodeBlockTypes.Props> = (props) => {
  const className = [styles.root, props.className].filter(Boolean).join(" ");

  return (
    <div className={className}>
      <div className={styles.header} aria-hidden="true">
        <Typography.Text component="span" className={styles.language}>
          {props.language}
        </Typography.Text>
        <Typography.Text component="span" className={styles.kind}>
          пример
        </Typography.Text>
      </div>
      <CodeHighlight
        aria-label={props.label}
        className={styles.highlight}
        code={props.code}
        language={props.language}
        copyLabel="Копировать код"
        copiedLabel="Код скопирован"
        codeColorScheme="dark"
        background="var(--color-code)"
        radius={0}
      />
    </div>
  );
};
