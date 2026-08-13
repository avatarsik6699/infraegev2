import { Text } from "@mantine/core";
import type { TypographyTypes } from "../typography.types";
import styles from "./typography-text.module.css";

export const TypographyText: React.FC<TypographyTypes.TextProps> = (props) => {
  const {
    ariaLabel,
    children,
    className,
    component = "p",
    size,
    tone,
    ...textProps
  } = props;

  return (
    <Text
      component={component}
      size={size}
      aria-label={ariaLabel}
      data-tone={tone}
      {...textProps}
      className={[tone ? styles.tone : undefined, className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Text>
  );
};
