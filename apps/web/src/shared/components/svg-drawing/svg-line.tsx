import { useId } from "react";
import { SvgFadeGradient } from "./svg-fade-gradient";
import { svgDrawing } from "./svg-drawing.lib";
import type { SvgDrawingTypes } from "./svg-drawing.types";

export const SvgLine: React.FC<SvgDrawingTypes.LineProps> = (props) => {
  const reactId = useId();
  const gradientId = svgDrawing.normalizeResourceId(reactId, "line");

  return (
    <>
      {props.fade ? (
        <defs>
          <SvgFadeGradient fade={props.fade} id={gradientId} />
        </defs>
      ) : null}
      <path
        className={props.className}
        d={props.d}
        data-svg-drawing="line"
        fill="none"
        opacity={props.opacity}
        pathLength={props.pathLength}
        stroke={props.fade ? svgDrawing.paintUrl(gradientId) : "currentColor"}
        strokeDasharray={props.dashArray}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={props.strokeWidth}
        transform={props.transform}
        vectorEffect={props.scaleStroke ? undefined : "non-scaling-stroke"}
      />
    </>
  );
};
