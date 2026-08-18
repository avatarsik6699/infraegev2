import { ImageOff } from "lucide-react";
import { Typography } from "~/shared/components/typography";
import styles from "../image.module.css";

type ImageErrorStateProps = {
  alt: string;
  decorative: boolean;
};

export const ImageErrorState: React.FC<ImageErrorStateProps> = (props) => (
  <div
    className={styles.errorState}
    role="img"
    aria-label={props.decorative ? undefined : props.alt}
    aria-hidden={props.decorative || undefined}
  >
    <ImageOff
      className={styles.errorIcon}
      size={20}
      strokeWidth={1.5}
      aria-hidden="true"
    />
    <Typography.Text variant="caption" tone="muted">
      Изображение недоступно
    </Typography.Text>
  </div>
);
