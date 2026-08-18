export namespace TypographyTypes {
  export type Tone = "default" | "muted" | "accent" | "highlight";
  export type TextRole = "body" | "lead" | "caption" | "interface";

  export type TextProps = React.HTMLAttributes<HTMLElement> & {
    children: React.ReactNode;
    component?: "p" | "span" | "div";
    variant?: TextRole;
    tone?: Tone;
    truncate?: boolean;
    lineClamp?: number;
    ariaLabel?: string;
  };

  export type TitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
    children: React.ReactNode;
    order: 1 | 2 | 3 | 4 | 5 | 6;
    lineClamp?: number;
    ref?: React.Ref<HTMLHeadingElement>;
  };

  export type ProseProps = React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
  };
}
