import { Typography } from "~/shared/components/typography";
import { LessonOutline } from "~/widgets/lesson-outline";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { CatalogLayout } from "./catalog-layout";
import {
  CatalogContractMap,
  type CatalogContract,
} from "./catalog-contract-map";
import { widgetSections } from "./design-system-lab.constants";
import { WidgetPracticeFlowSpecimen } from "./widget-practice-flow-specimen";
import styles from "./design-system-lab.module.css";

const live = (name: string, note: string): CatalogContract => ({
  name,
  note,
  status: "live",
});

const widgetContracts = {
  chrome: [
    live("PublicHeader", "ALCHIMIA-айдентика и версия публичных страниц"),
    live("PublicFooter", "Действующая навигация в подвале"),
  ],
  learning: [
    live("LessonOutline", "Содержание урока и активная смысловая ветка"),
  ],
  flow: [
    live("LessonPracticeFlow", "Практика, связанная с локальным прогрессом"),
  ],
} as const;

const outlineGroups = [
  {
    id: "widget-overview",
    label: "Введение",
    items: [
      { id: "widget-definition", label: "Что проверяем" },
      { id: "widget-example", label: "Пример" },
    ],
  },
  {
    id: "widget-practice",
    label: "Практика",
    items: [{ id: "widget-result", label: "Результат" }],
  },
];

export const WidgetsCatalog: React.FC = () => (
  <CatalogLayout
    title="Виджеты"
    description="Составные части страниц: они соединяют самостоятельные компоненты, навигацию и состояние в законченную продуктовую область."
    sections={widgetSections}
  >
    <section
      className={styles.section}
      id="widgets-chrome"
      aria-labelledby="widgets-chrome-heading"
    >
      <Typography.Title
        order={3}
        id="widgets-chrome-heading"
        className={styles.patternHeading}
      >
        Навигация приложения
      </Typography.Title>
      <CatalogContractMap
        contracts={widgetContracts.chrome}
        label="Контракты навигации приложения"
      />
      <div
        className={styles.widgetSpecimen}
        data-widget-specimen="PublicChrome"
      >
        <code className={styles.typeTag}>ALCHIMIA · public chrome</code>
        <div className={styles.widgetCanvas}>
          <PublicHeader home />
          <div className={styles.widgetPlaceholder}>
            <Typography.Text>
              Центральная область действующей публичной страницы.
            </Typography.Text>
          </div>
          <PublicFooter />
        </div>
      </div>
    </section>

    <section
      className={styles.section}
      id="widgets-learning"
      aria-labelledby="widgets-learning-heading"
    >
      <Typography.Title
        order={3}
        id="widgets-learning-heading"
        className={styles.patternHeading}
      >
        Навигация урока
      </Typography.Title>
      <CatalogContractMap
        contracts={widgetContracts.learning}
        label="Контракты навигации урока"
      />
      <div
        className={styles.outlineSpecimen}
        data-widget-specimen="LessonOutline"
      >
        <LessonOutline groups={outlineGroups} activeId="widget-definition" />
        <div className={styles.outlineContent}>
          <Typography.Title order={4} id="widget-overview">
            Введение
          </Typography.Title>
          <Typography.Text id="widget-definition">
            Outline показывает текущую группу и сохраняет обычные якорные ссылки
            без JavaScript.
          </Typography.Text>
          <Typography.Text id="widget-example">
            В реальном уроке список строится из authored section ids.
          </Typography.Text>
          <Typography.Title order={4} id="widget-practice">
            Практика
          </Typography.Title>
          <Typography.Text id="widget-result">
            Практика и результат остаются отдельной смысловой группой.
          </Typography.Text>
        </div>
      </div>
    </section>

    <section
      className={styles.section}
      id="widgets-flow"
      aria-labelledby="widgets-flow-heading"
    >
      <Typography.Title
        order={3}
        id="widgets-flow-heading"
        className={styles.patternHeading}
      >
        Учебный flow
      </Typography.Title>
      <CatalogContractMap
        contracts={widgetContracts.flow}
        label="Контракты учебного flow"
      />
      <Typography.Text className={styles.placeholder}>
        Виджет соединяет публичный feature <code>LessonPractice</code> с
        локальным progress store. Внутренние части формы не становятся
        самостоятельными контрактами каталога.
      </Typography.Text>
      <WidgetPracticeFlowSpecimen />
    </section>

    <section
      className={styles.section}
      id="widgets-layout"
      aria-labelledby="widgets-layout-heading"
    >
      <Typography.Title
        order={3}
        id="widgets-layout-heading"
        className={styles.patternHeading}
      >
        Композиции страниц
      </Typography.Title>
      <Typography.Text className={styles.placeholder}>
        Это lab-only схемы сборки, а не новые production-компоненты. Они
        показывают границы существующих widgets и не создают ещё один layout
        API.
      </Typography.Text>
      <div className={styles.assemblyGrid}>
        <figure
          className={styles.assemblyMap}
          data-widget-assembly="public-page"
        >
          <figcaption>
            <code>Public page</code>
            <span>Действующая публичная композиция</span>
          </figcaption>
          <ol className={styles.assemblySequence}>
            <li>
              <code>PublicHeader</code>
              <span>Айдентика и версия</span>
            </li>
            <li>
              <code>Page content</code>
              <span>Содержание маршрута</span>
            </li>
            <li>
              <code>PublicFooter</code>
              <span>Служебная навигация</span>
            </li>
          </ol>
        </figure>
        <figure
          className={styles.assemblyMap}
          data-widget-assembly="lesson-page"
        >
          <figcaption>
            <code>Lesson page</code>
            <span>Действующая учебная композиция</span>
          </figcaption>
          <ol className={styles.assemblySequence}>
            <li>
              <code>PublicHeader</code>
              <span>Переход на главную</span>
            </li>
            <li>
              <code>LessonOutline</code>
              <span>Навигация рядом с чтением</span>
            </li>
            <li>
              <code>LessonPracticeFlow</code>
              <span>Практика и прогресс</span>
            </li>
            <li>
              <code>PublicFooter</code>
              <span>Завершение страницы</span>
            </li>
          </ol>
        </figure>
      </div>
    </section>
  </CatalogLayout>
);
