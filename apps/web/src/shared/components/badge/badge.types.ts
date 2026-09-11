import type { HTMLAttributes } from "react";

export namespace BadgeTypes {
  export type Tone = "neutral" | "accent" | "success" | "warning";

  export type Props = HTMLAttributes<HTMLSpanElement> & {
    tone?: Tone;
    presentation?: "status" | "metadata" | "index";
    icon?: React.ReactNode;
    fullWidth?: boolean;
  };
}
