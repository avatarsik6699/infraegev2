import type { ComponentPropsWithoutRef, ReactNode } from "react";

export namespace SurfaceDecorationTypes {
  export type MaterialProps = { className?: string; children?: ReactNode };
  export type GlintProps = Omit<
    ComponentPropsWithoutRef<"span">,
    "children"
  > & {
    kind: "frame" | "sweep" | "soft";
    active: boolean;
    playback?: "once" | "loop";
  };
}
