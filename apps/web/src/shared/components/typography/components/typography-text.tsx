import { Text } from "@mantine/core";
import type { TypographyTypes } from "../typography.types";

const toneColor: Record<TypographyTypes.Tone, string> = {
  default: "var(--color-text)",
  muted: "var(--color-muted)",
  accent: "var(--color-accent)",
  highlight: "var(--color-highlight)",
};

export const TypographyText: React.FC<TypographyTypes.TextProps> = (props) => {
  return (
    <Text
      component={props.component ?? "p"}
      c={toneColor[props.tone ?? "default"]}
      size={props.size}
      className={props.className}
      aria-label={props.ariaLabel}
    >
      {props.children}
    </Text>
  );
};
