import { Image } from "~/shared/components/image";
import { Typography } from "~/shared/components/typography";
import type { FigureBlockTypes } from "./figure-block.types";
import styles from "./figure-block.module.css";

export const FigureBlock: React.FC<FigureBlockTypes.Props> = (props) => {
  return (
    <figure className={styles.root}>
      <div className={styles.surface}>
        <Image
          src={props.data.src}
          alt={props.data.alt}
          width={props.data.width}
          height={props.data.height}
          fit="contain"
          className={styles.image}
        />
      </div>
      {props.data.caption && (
        <figcaption className={styles.caption}>
          <Typography.Text component="span" tone="muted" size="sm">
            {props.data.caption}
          </Typography.Text>
        </figcaption>
      )}
    </figure>
  );
};
