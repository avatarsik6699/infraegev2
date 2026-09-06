import { Link } from "@tanstack/react-router";
import { SvgDrawing } from "~/shared/components/svg-drawing";
import { Typography } from "~/shared/components/typography";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { HomeLearningMap } from "./home-learning-map";
import styles from "./foundation-page.module.css";

const foundationDrawing = {
  actionUnderlineFade: {
    from: { x: 3, y: 0 },
    to: { x: 223, y: 0 },
    stops: [
      { offset: 0, opacity: 0 },
      { offset: 0.08, opacity: 0.72 },
      { offset: 0.22, opacity: 1 },
      { offset: 0.82, opacity: 0.94 },
      { offset: 1, opacity: 0 },
    ],
  },
  actionArrowFade: {
    from: { x: 247, y: 0 },
    to: { x: 305, y: 0 },
    stops: [
      { offset: 0, opacity: 0 },
      { offset: 0.3, opacity: 0.72 },
      { offset: 1, opacity: 1 },
    ],
  },
} as const;

export const FoundationPage: React.FC = () => (
  <div className={styles.page}>
    <PublicHeader home />
    <main className={styles.hero} data-foundation-layout>
      <section className={styles.intro}>
        <Typography.Title className={styles.heroTitle} order={1}>
          <span>Информатика -</span>
          <span>это система</span>
        </Typography.Title>
        <Typography.Text className={styles.lead} variant="lead">
          Подготовка к ЕГЭ без зубрёжки
        </Typography.Text>
        <Link
          className={styles.primaryAction}
          to="/courses/$courseSlug"
          params={{ courseSlug: "python" }}
        >
          <span>Начать подготовку</span>
          <svg
            className={styles.actionDrawing}
            viewBox="0 0 312 48"
            aria-hidden="true"
          >
            <g data-action-underline>
              <SvgDrawing.TaperedLine
                d="M3 38.7C43 34.7 105 34.2 155 35.5c28 .7 51 2.1 68 2.8-18 .1-43-.4-69-1.1-51-1.3-112-.5-151 2.2Z"
                fade={foundationDrawing.actionUnderlineFade}
              />
            </g>
            <g className={styles.actionArrowGroup} data-action-arrow>
              <SvgDrawing.Arrow
                shaft={{
                  kind: "tapered",
                  d: "M247 24.8c18-.4 39-1.5 57-2.7l.1 1.1c-18 1.5-39 2.5-57.1 2.1Z",
                  fade: foundationDrawing.actionArrowFade,
                }}
                head={{
                  d: "M292.5 10.7c4.9 4 8.7 7.7 12.2 11.8-3.3 4.7-7.3 9.1-11.8 13.2",
                  strokeWidth: 1.9,
                }}
                echoes={[
                  {
                    id: "head-echo",
                    d: "M294.2 11.9c4.1 3.3 7.4 6.6 10.3 10.3",
                    strokeWidth: 0.8,
                    opacity: 0.3,
                  },
                ]}
              />
            </g>
          </svg>
        </Link>
      </section>

      <section
        className={styles.visual}
        aria-label="Учебный путь: теория, практика, задания и будущая статистика"
      >
        <Typography.Text className={styles.visuallyHidden}>
          Сначала разберите теорию, затем закрепите её на практике и переходите
          к заданиям. Персональная статистика появится позже.
        </Typography.Text>
        <HomeLearningMap />
      </section>
    </main>
    <PublicFooter />
  </div>
);
