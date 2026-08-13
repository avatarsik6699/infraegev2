import { Title } from "@mantine/core";
import type { TypographyTypes } from "../typography.types";

export const TypographyTitle: React.FC<TypographyTypes.TitleProps> = (
  props,
) => {
  const { children, order, ...headingProps } = props;

  return (
    <Title order={order} {...headingProps}>
      {children}
    </Title>
  );
};
