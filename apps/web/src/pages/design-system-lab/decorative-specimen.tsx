import { CustomIcon } from "~/shared/components/custom-icon";
import { SvgDrawing } from "~/shared/components/svg-drawing";
import { SvgPattern } from "~/shared/components/svg-pattern";
import { Typography } from "~/shared/components/typography";
import styles from "./design-system-lab.module.css";

export const DecorativeSpecimen: React.FC = () => (
  <figure data-component-specimen="DecorativePrimitives">
    <CustomIcon.Root viewBox="0 0 360 72" className={styles.decorativeSpecimen}>
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
        рисует связь. Это декоративный пример для публичных композиций; учебный
        смысл остаётся в тексте.
      </Typography.Text>
    </figcaption>
  </figure>
);
