import type { LucideIcon } from "lucide-react";
import styles from "./code-block.module.css";

type CodeBlockLabelProps = {
  /** A small muted mark that tells the sections apart at a glance. */
  icon: LucideIcon;
  children: React.ReactNode;
};

/**
 * The label of a section under the code (Change 175): «Вывод:», «Строка N:»,
 * «Переменные:» — the same quiet caption, each with its own small mark.
 */
export const CodeBlockLabel: React.FC<CodeBlockLabelProps> = ({
  icon: Icon,
  children,
}) => (
  <span className={styles.sectionLabel}>
    <Icon
      className={styles.sectionIcon}
      aria-hidden="true"
      size={14}
      strokeWidth={1.75}
    />
    {children}
  </span>
);
