import { TypographyProse } from "./components/typography-prose";
import { TypographyText } from "./components/typography-text";
import { TypographyTitle } from "./components/typography-title";

export const Typography = {
  Text: TypographyText,
  Title: TypographyTitle,
  Prose: TypographyProse,
} as const;
