import { Anchor, createTheme } from "@mantine/core";

export const appMantineTheme = createTheme({
  components: {
    Anchor: Anchor.extend({ defaultProps: { underline: "hover" } }),
  },
});
