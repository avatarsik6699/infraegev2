import { CircleHelp } from "lucide-react";
import { Accordion } from "~/shared/components/accordion";
import { Divider } from "~/shared/components/divider";
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
    <section className={styles.root} aria-label="Проверьте себя">
      <Divider />
      <Typography.Text component="p" className={styles.eyebrow}>
        Проверьте себя
      </Typography.Text>
      <Accordion
        multiple
        items={props.items.map((item) => ({
          id: item.id,
          title: item.prompt,
          content: item.reveal,
          icon: <CircleHelp size={18} strokeWidth={1.75} />,
        }))}
      />
    </section>
  );
};
