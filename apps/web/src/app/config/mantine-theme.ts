import { Anchor, Button, createTheme } from "@mantine/core";

export const appMantineTheme = createTheme({
  colors: {
    ember: [
      "#fff5ef",
      "#ffe8dc",
      "#fbd0bc",
      "#f5af90",
      "#ee8962",
      "#e96c43",
      "#df5732",
      "#bd4326",
      "#98371f",
      "#7c311f",
    ],
  },
  primaryColor: "ember",
  primaryShade: 7,
  fontFamily: '"Onest Variable", "Onest Fallback", Arial, sans-serif',
  fontFamilyMonospace: '"SFMono-Regular", Consolas, monospace',
  headings: {
    fontFamily: '"Literata Variable", "Literata Fallback", Georgia, serif',
    fontWeight: "650",
    sizes: {
      h1: { fontSize: "clamp(2.4rem, 4.35vw, 4.6rem)", lineHeight: "1.03" },
      h2: { fontSize: "clamp(1.7rem, 2.5vw, 2.4rem)", lineHeight: "1.12" },
      h3: { fontSize: "1.35rem", lineHeight: "1.25" },
    },
  },
  defaultRadius: "xs",
  focusRing: "auto",
  respectReducedMotion: true,
  components: {
    Anchor: Anchor.extend({ defaultProps: { underline: "hover" } }),
    Button: Button.extend({
      defaultProps: { color: "ember", radius: "xl" },
    }),
  },
});
