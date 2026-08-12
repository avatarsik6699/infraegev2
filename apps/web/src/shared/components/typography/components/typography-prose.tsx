import { Typography as MantineTypography } from "@mantine/core";
import type { TypographyTypes } from "../typography.types";

export const TypographyProse: React.FC<TypographyTypes.ProseProps> = (
  props,
) => {
  return (
    <MantineTypography className={props.className}>
      {props.children}
    </MantineTypography>
  );
};
