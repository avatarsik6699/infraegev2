export namespace SvgDrawingTypes {
  export type Point = {
    x: number;
    y: number;
  };

  export type FadeStop = {
    color?: string;
    offset: number;
    opacity: number;
  };

  export type Fade = {
    from: Point;
    to: Point;
    stops: readonly FadeStop[];
  };

  type PathBase = {
    d: string;
    className?: string;
    fade?: Fade;
    opacity?: number;
    transform?: string;
  };

  export type LineProps = PathBase & {
    strokeWidth: number;
    dashArray?: string;
    pathLength?: number;
    scaleStroke?: boolean;
  };

  export type TaperedLineProps = PathBase;

  export type LineShaft = LineProps & {
    kind: "line";
  };

  export type TaperedShaft = TaperedLineProps & {
    kind: "tapered";
  };

  export type ArrowEcho = LineProps & {
    id: string;
  };

  export type FilledArrowHead = PathBase & {
    kind: "filled";
  };

  export type LineArrowHead = LineProps & {
    kind?: "line";
  };

  export type ArrowProps = {
    shaft: LineShaft | TaperedShaft;
    head: FilledArrowHead | LineArrowHead;
    echoes?: readonly ArrowEcho[];
    className?: string;
    opacity?: number;
    transform?: string;
  };

  export type FadeGradientProps = {
    fade: Fade;
    id: string;
    stopColor?: string;
  };
}
