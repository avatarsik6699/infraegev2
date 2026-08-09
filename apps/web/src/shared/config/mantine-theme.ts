import { Anchor, createTheme } from "@mantine/core";

export const appMantineTheme = createTheme({
  primaryColor: "textbook",
  primaryShade: 6,
  white: "#faf8f3",
  black: "#1c1a17",
  colors: {
    textbook: [
      "#eef1fb",
      "#dce2f5",
      "#bac5eb",
      "#96a6df",
      "#788bd5",
      "#6075ca",
      "#3450a3",
      "#2d448b",
      "#263a77",
      "#1e2f63",
    ],
    highlight: [
      "#fbf0eb",
      "#f4ddd2",
      "#eac0ae",
      "#dfa087",
      "#d68767",
      "#cc734f",
      "#b4562b",
      "#984724",
      "#803c20",
      "#69321c",
    ],
  },
  fontFamily: '"Source Serif 4", Georgia, serif',
  fontFamilyMonospace:
    '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
  headings: {
    fontFamily: '"Fraunces", "Source Serif 4", Georgia, serif',
    fontWeight: "700",
  },
  lineHeights: { md: "1.7" },
  spacing: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2.5rem",
  },
  radius: { sm: "0.25rem" },
  components: {
    Anchor: Anchor.extend({ defaultProps: { underline: "hover" } }),
  },
});
