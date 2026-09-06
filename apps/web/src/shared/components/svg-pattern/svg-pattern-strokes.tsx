import { SvgDrawing } from "~/shared/components/svg-drawing";
import type { SvgPatternTypes } from "./svg-pattern.types";

export const SvgPatternStrokes: React.FC<SvgPatternTypes.StrokesProps> = (
  props,
) => (
  <g
    className={props.className}
    data-svg-pattern="strokes"
    transform={props.transform}
  >
    {props.strokes.map(({ echoes, id, ...stroke }) => (
      <g key={id} data-pattern-stroke={id}>
        <SvgDrawing.Line {...stroke} />
        {echoes?.map((echo) => {
          const { id: echoId, ...echoStroke } = echo;

          return <SvgDrawing.Line key={echoId} {...echoStroke} />;
        })}
      </g>
    ))}
  </g>
);
