export namespace TypographyTypes {
  export type Tone = "default" | "muted" | "accent" | "highlight";

  export type TextProps = {
    children: React.ReactNode;
    component?: "p" | "span" | "div";
    tone?: Tone;
    size?: "sm" | "md" | "lg";
    className?: string;
    ariaLabel?: string;
  };

  export type TitleProps = {
    children: React.ReactNode;
    order: 1 | 2 | 3;
    className?: string;
  };

  export type ProseProps = {
    children: React.ReactNode;
    className?: string;
  };
}
