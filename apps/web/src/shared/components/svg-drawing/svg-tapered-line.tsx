import { useId } from "react";
import { SvgFadeGradient } from "./svg-fade-gradient";
import { svgDrawing } from "./svg-drawing.lib";
import type { SvgDrawingTypes } from "./svg-drawing.types";

export const SvgTaperedLine: React.FC<SvgDrawingTypes.TaperedLineProps> = (
  props,
) => {
  const reactId = useId();
  const gradientId = svgDrawing.normalizeResourceId(reactId, "tapered-line");

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
        data-svg-drawing="tapered-line"
        fill={props.fade ? svgDrawing.paintUrl(gradientId) : "currentColor"}
        opacity={props.opacity}
        transform={props.transform}
      />
    </>
  );
};
