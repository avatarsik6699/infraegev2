import { useId, useState } from "react";
import {
  TabsList,
  TabsPanel,
  TabsRoot,
  TabsTab,
} from "~/shared/components/tabs";
import { Typography } from "~/shared/components/typography";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import styles from "./checkpoint.module.css";

type CheckpointItem = {
  id: string;
  prompt: React.ReactNode;
  reveal: React.ReactNode;
};

type Props = {
  items: readonly CheckpointItem[];
  /** The section heading's level: 2 on a subtopic page, 3 inside a section. */
  headingOrder?: 2 | 3 | 4;
  headingClassName?: string;
};

/** One question: its text, then the practice task's soft «Ответ» toggle. A
 *  native `details`, so the answer opens from the keyboard without scripts. */
const Question: React.FC<{ item: CheckpointItem; number: number }> = (
  props,
) => (
  <div className={styles.question}>
    <span className={styles.number}>{`Вопрос ${String(props.number)}`}</span>
    <div className={styles.prompt}>{props.item.prompt}</div>
    <details className={styles.answer}>
      <summary className={styles.toggle}>
        <span className={styles.toggleLabel}>
          <span className={styles.reserve} aria-hidden="true">
            Скрыть ответ
          </span>
          <span className={styles.closed}>Ответ</span>
          <span className={styles.open}>Скрыть ответ</span>
        </span>
      </summary>
      <div className={styles.panel}>
        <Typography.Text component="div" className={styles.caption}>
          Ответ
        </Typography.Text>
        <div className={styles.reveal}>{props.item.reveal}</div>
      </div>
    </details>
  </div>
);

/**
 * «Проверьте себя» (Change 184; Change 186 F54): the questions as tabs, like
 * the practice tasks, one at a time. Without scripts
 * the panels stand one under another, each named «Вопрос N»; a single
 * question needs no tab strip.
 */
export const Checkpoint: React.FC<Props> = (props) => {
  const headingId = useId();
  const enhanced = useIsEnhanced();
  const [active, setActive] = useState(props.items[0]?.id ?? "");
  const tabbed = props.items.length > 1;
  return (
    <section
      className={styles.root}
      data-learning-block
      data-checkpoint
      aria-labelledby={headingId}
    >
      <Typography.Title
        order={props.headingOrder ?? 2}
        id={headingId}
        className={props.headingClassName}
      >
        Проверьте себя
      </Typography.Title>
      <Typography.Text className={styles.lead}>
        Ответь сначала сам, потом открой ответ.
      </Typography.Text>
      {tabbed ? (
        <TabsRoot value={active} onValueChange={setActive}>
          <TabsList
            className={styles.tabs}
            label="Вопросы для самопроверки"
            hidden={!enhanced}
          >
            {props.items.map((item, index) => (
              <TabsTab key={item.id} value={item.id} className={styles.tab}>
                {`Вопрос ${String(index + 1)}`}
              </TabsTab>
            ))}
          </TabsList>
          {props.items.map((item, index) => (
            <TabsPanel
              key={item.id}
              value={item.id}
              className={styles.tabPanel}
            >
              <Question item={item} number={index + 1} />
            </TabsPanel>
          ))}
        </TabsRoot>
      ) : (
        props.items.map((item) => (
          <div key={item.id} className={styles.single}>
            <Question item={item} number={1} />
          </div>
        ))
      )}
    </section>
  );
};
