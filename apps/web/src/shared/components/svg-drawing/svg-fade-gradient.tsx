import type { SvgDrawingTypes } from "./svg-drawing.types";

export const SvgFadeGradient: React.FC<SvgDrawingTypes.FadeGradientProps> = (
  props,
) => (
  <linearGradient
    id={props.id}
    x1={props.fade.from.x}
    y1={props.fade.from.y}
    x2={props.fade.to.x}
    y2={props.fade.to.y}
    gradientUnits="userSpaceOnUse"
  >
    {props.fade.stops.map((stop) => (
      <stop
        key={`${String(stop.offset)}-${String(stop.opacity)}`}
        offset={stop.offset}
        stopColor={props.stopColor ?? "currentColor"}
        stopOpacity={stop.opacity}
      />
    ))}
  </linearGradient>
);
