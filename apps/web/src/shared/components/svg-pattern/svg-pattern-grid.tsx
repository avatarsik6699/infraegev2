import { useId } from "react";
import { svgResource } from "~/shared/lib/svg-resource";
import { SvgPatternField } from "./svg-pattern-field";
import type { SvgPatternTypes } from "./svg-pattern.types";

export const SvgPatternGrid: React.FC<SvgPatternTypes.GridProps> = (props) => {
  const id = svgResource.normalizeId(useId(), "pattern", "grid");
  return (
    <SvgPatternField
      bounds={props.bounds}
      fade={props.fade}
      className={props.className}
      name={props.name}
      opacity={props.opacity}
    >
      <defs>
        <pattern
          id={id}
          width={props.cell.width}
          height={props.cell.height}
          patternUnits="userSpaceOnUse"
          patternTransform={props.transform}
        >
          <path
            d={`M${String(props.cell.width)} 0H0V${String(props.cell.height)}`}
            fill="none"
            className={props.lineClassName}
          />
          {props.node ? (
            <circle
              cx="0"
              cy="0"
              r={props.node.radius}
              className={props.node.className}
            />
          ) : null}
        </pattern>
      </defs>
      <rect
        x={props.bounds.x}
        y={props.bounds.y}
        width={props.bounds.width}
        height={props.bounds.height}
        fill={svgResource.paintUrl(id)}
      />
    </SvgPatternField>
  );
};
