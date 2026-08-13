export namespace TypographyTypes {
  export type Tone = "default" | "muted" | "accent" | "highlight";

  export type TextProps = React.HTMLAttributes<HTMLElement> & {
    children: React.ReactNode;
    component?: "p" | "span" | "div";
    tone?: Tone;
    size?: "sm" | "md" | "lg";
    ariaLabel?: string;
  };

  export type TitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
    children: React.ReactNode;
    order: 1 | 2 | 3 | 4 | 5 | 6;
    ref?: React.Ref<HTMLHeadingElement>;
  };

  export type ProseProps = {
    children: React.ReactNode;
    className?: string;
  };
}
