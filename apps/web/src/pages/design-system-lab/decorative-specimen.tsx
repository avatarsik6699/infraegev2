import { useId } from "react";
import { CustomIcon } from "~/shared/components/custom-icon";
import { SvgDrawing } from "~/shared/components/svg-drawing";
import { SvgPattern } from "~/shared/components/svg-pattern";
import { Typography } from "~/shared/components/typography";
import styles from "./design-system-lab.module.css";

export const DecorativeSpecimen: React.FC = () => {
  const fadeId = useId();
  return (
    <figure data-component-specimen="DecorativePrimitives">
      <div aria-label="Рисованные значки">
        <CustomIcon.Book width={40} height={40} label="Книга" />
        <CustomIcon.Checklist width={40} height={40} label="План" />
        <CustomIcon.Braces width={40} height={40} label="Код" />
        <CustomIcon.BarChart width={40} height={40} label="Диаграмма" />
        <CustomIcon.Check width={40} height={40} label="Готово" />
      </div>
      <CustomIcon.Root
        viewBox="0 0 360 72"
        className={styles.decorativeSpecimen}
      >
        <defs>
          <SvgDrawing.FadeGradient
            id={fadeId}
            fade={{
              from: { x: 0, y: 0 },
              to: { x: 360, y: 0 },
              stops: [
                { offset: 0, opacity: 0.15 },
                { offset: 1, opacity: 0.6 },
              ],
            }}
          />
        </defs>
        <rect
          x={0}
          y={0}
          width={360}
          height={72}
          fill={`url(#${fadeId})`}
          opacity={0.1}
        />
        <SvgPattern.Grid
          bounds={{ x: 0, y: 0, width: 360, height: 72 }}
          cell={{ width: 24, height: 24 }}
          opacity={0.1}
        />
        <SvgPattern.Preset
          bounds={{ x: 0, y: 0, width: 360, height: 72 }}
          nodes={[{ id: "origin", cx: 12, cy: 50, r: 3 }]}
        />
        <SvgDrawing.Line d="M 12 66 H 100" strokeWidth={1} opacity={0.4} />
        <SvgDrawing.TaperedLine
          d="M 120 65 L 220 65 L 120 67 Z"
          opacity={0.4}
        />
        <SvgPattern.Field bounds={{ x: 0, y: 0, width: 360, height: 72 }}>
          <SvgPattern.Strokes
            strokes={[
              {
                id: "baseline",
                d: "M 12 56 H 348",
                strokeWidth: 1,
                opacity: 0.3,
              },
            ]}
          />
          <SvgDrawing.Arrow
            shaft={{
              kind: "line",
              d: "M 12 50 C 120 50 200 18 340 18",
              strokeWidth: 2,
            }}
            head={{ d: "M 332 10 L 340 18 L 332 26", strokeWidth: 2 }}
          />
        </SvgPattern.Field>
      </CustomIcon.Root>
      <figcaption>
        <Typography.Text variant="interface" tone="muted">
          CustomIcon задаёт SVG-контекст, SvgPattern собирает поле, SvgDrawing
          рисует связь. Это декоративный пример для публичных композиций;
          учебный смысл остаётся в тексте.
        </Typography.Text>
      </figcaption>
    </figure>
  );
};
