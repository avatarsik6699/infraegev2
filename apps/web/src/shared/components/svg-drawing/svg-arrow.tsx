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
    {props.echoes?.map((echo) => (
      <SvgLine key={echo.id} {...echo} />
    ))}
    <g data-svg-drawing-part="shaft">
      {props.shaft.kind === "line" ? (
        <SvgLine {...props.shaft} />
      ) : (
        <SvgTaperedLine {...props.shaft} />
      )}
    </g>
    {props.head.kind === "filled" ? (
      <path
        className={props.head.className}
        d={props.head.d}
        data-svg-drawing="arrow-head"
        fill="currentColor"
        opacity={props.head.opacity}
        transform={props.head.transform}
      />
    ) : (
      <SvgLine {...props.head} />
    )}
  </g>
);
