import { ChevronDown } from "lucide-react";
import { cssUtils } from "~/shared/lib/css-utils";
import type { AccordionTypes } from "./accordion.types";
import styles from "./accordion.module.css";

export const AccordionNativeFallback: React.FC<AccordionTypes.Props> = (
  props,
) => (
  <div
    className={cssUtils.cx(styles.root, props.className)}
    data-unenhanced-accordion=""
  >
    {props.items.map((item) => (
      <details
        className={styles.item}
        key={item.id}
        open={props.defaultOpen?.includes(item.id)}
      >
        <summary
          className={styles.trigger}
          data-has-leading={item.icon ? "true" : undefined}
        >
          {item.icon ? (
            <span className={styles.leading} aria-hidden="true">
              {item.icon}
            </span>
          ) : null}
          <span className={styles.title}>{item.title}</span>
          <ChevronDown
            className={styles.chevron}
            aria-hidden="true"
            size={18}
            strokeWidth={1.75}
          />
        </summary>
        <div className={styles.content}>{item.content}</div>
      </details>
    ))}
  </div>
);
