import { useId } from "react";
import { SvgDrawing } from "~/shared/components/svg-drawing";
import { svgResource } from "~/shared/lib/svg-resource";
import type { SvgPatternTypes } from "./svg-pattern.types";

export const SvgPatternField: React.FC<SvgPatternTypes.FieldProps> = (
  props,
) => {
  const reactId = useId();
  const gradientId = svgResource.normalizeId(reactId, "pattern", "fade");
  const maskId = svgResource.normalizeId(reactId, "pattern", "mask");

  return (
    <>
      {props.fade ? (
        <defs>
          <SvgDrawing.FadeGradient
            fade={props.fade}
            id={gradientId}
            stopColor="white"
          />
          <mask
            id={maskId}
            x={props.bounds.x}
            y={props.bounds.y}
            width={props.bounds.width}
            height={props.bounds.height}
            maskContentUnits="userSpaceOnUse"
            maskUnits="userSpaceOnUse"
          >
            <rect
              x={props.bounds.x}
              y={props.bounds.y}
              width={props.bounds.width}
              height={props.bounds.height}
              fill={svgResource.paintUrl(gradientId)}
            />
          </mask>
        </defs>
      ) : null}
      <g
        className={props.className}
        data-pattern-name={props.name}
        data-svg-pattern="field"
        mask={props.fade ? svgResource.paintUrl(maskId) : undefined}
        opacity={props.opacity}
      >
        {props.children}
      </g>
    </>
  );
};
