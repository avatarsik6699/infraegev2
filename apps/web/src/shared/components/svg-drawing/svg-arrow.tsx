import { SvgLine } from "./svg-line";
import { SvgTaperedLine } from "./svg-tapered-line";
import type { SvgDrawingTypes } from "./svg-drawing.types";

export const SvgArrow: React.FC<SvgDrawingTypes.ArrowProps> = (props) => (
  <g
    className={props.className}
    data-svg-drawing="arrow"
    opacity={props.opacity}
    transform={props.transform}
  >
    {props.shaft.kind === "line" ? (
      <SvgLine {...props.shaft} />
    ) : (
      <SvgTaperedLine {...props.shaft} />
    )}
    {props.echoes?.map((echo) => (
      <SvgLine key={echo.id} {...echo} />
    ))}
    <SvgLine {...props.head} />
  </g>
);
