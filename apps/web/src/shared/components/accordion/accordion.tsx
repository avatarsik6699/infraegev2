import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { ChevronDown } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cssUtils } from "~/shared/lib/css-utils";
import { enhancementState } from "~/shared/lib/enhancement-state";
import type { AccordionTypes } from "./accordion.types";
import styles from "./accordion.module.css";

export const Accordion: React.FC<AccordionTypes.Props> = ({
  items,
  defaultOpen = [],
  multiple = false,
  className,
}) => {
  const enhanced = useSyncExternalStore(
    enhancementState.subscribe,
    enhancementState.getClientSnapshot,
    enhancementState.getServerSnapshot,
  );

  if (!enhanced) {
    return (
      <div
        className={cssUtils.cx(styles.root, className)}
        data-unenhanced-accordion=""
      >
        {items.map((item) => (
          <div className={styles.item} key={item.id}>
            <div
              className={styles.staticHeader}
              data-has-leading={item.icon ? "true" : undefined}
            >
              {item.icon ? (
                <span className={styles.leading} aria-hidden="true">
                  {item.icon}
                </span>
              ) : null}
              <span className={styles.title}>{item.title}</span>
            </div>
            <div className={styles.content}>{item.content}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <BaseAccordion.Root
      className={cssUtils.cx(styles.root, className)}
      defaultValue={[...defaultOpen]}
      keepMounted
      multiple={multiple}
      data-enhanced="true"
    >
      {items.map((item) => (
        <BaseAccordion.Item
          className={styles.item}
          disabled={item.disabled}
          key={item.id}
          value={item.id}
        >
          <BaseAccordion.Header className={styles.header}>
            <BaseAccordion.Trigger
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
            </BaseAccordion.Trigger>
          </BaseAccordion.Header>
          <BaseAccordion.Panel className={styles.panel}>
            <div className={styles.content}>{item.content}</div>
          </BaseAccordion.Panel>
        </BaseAccordion.Item>
      ))}
    </BaseAccordion.Root>
  );
};
