import { SvgPatternField } from "./svg-pattern-field";
import { SvgPatternStrokes } from "./svg-pattern-strokes";
import type { SvgPatternTypes } from "./svg-pattern.types";

export const SvgPatternPreset: React.FC<SvgPatternTypes.PresetProps> = ({
  contentClassName,
  labels = [],
  nodes = [],
  strokes = [],
  transform,
  ...fieldProps
}) => (
  <SvgPatternField {...fieldProps}>
    <g
      className={contentClassName}
      data-svg-pattern="preset"
      transform={transform}
    >
      {strokes.length > 0 ? <SvgPatternStrokes strokes={strokes} /> : null}
      {labels.map((label) => (
        <text
          key={label.id}
          className={label.className}
          data-pattern-label={label.id}
          x={label.x}
          y={label.y}
          opacity={label.opacity}
          textAnchor={label.textAnchor}
        >
          {label.text}
        </text>
      ))}
      {nodes.map((node) => (
        <circle
          key={node.id}
          className={node.className}
          data-pattern-node={node.id}
          cx={node.cx}
          cy={node.cy}
          r={node.r}
          opacity={node.opacity}
        />
      ))}
    </g>
  </SvgPatternField>
);
