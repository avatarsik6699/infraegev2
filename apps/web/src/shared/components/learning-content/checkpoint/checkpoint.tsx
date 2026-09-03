import { CircleHelp } from "lucide-react";
import { Accordion } from "~/shared/components/accordion";
import { Typography } from "~/shared/components/typography";
import styles from "./checkpoint.module.css";

type CheckpointItem = {
  id: string;
  prompt: React.ReactNode;
  reveal: React.ReactNode;
};

type Props = {
  items: readonly CheckpointItem[];
};

export const Checkpoint: React.FC<Props> = (props) => {
  return (
    <section
      className={styles.root}
      data-learning-block
      aria-label="Проверьте себя"
    >
      <div className={styles.heading}>
        <CircleHelp
          className={styles.icon}
          aria-hidden="true"
          size={16}
          strokeWidth={1.8}
        />
        <Typography.Text component="div" className={styles.label}>
          Проверьте себя
        </Typography.Text>
      </div>
      <Accordion
        className={styles.content}
        multiple
        items={props.items.map((item) => ({
          id: item.id,
          title: item.prompt,
          content: item.reveal,
        }))}
      />
    </section>
  );
};
