import { Title } from "@mantine/core";
import type { TypographyTypes } from "../typography.types";

export const TypographyTitle: React.FC<TypographyTypes.TitleProps> = (
  props,
) => {
  return (
    <Title order={props.order} className={props.className}>
      {props.children}
    </Title>
  );
};
