import { Typography } from "~/shared/components/typography";
import { AlchimiaHeader } from "~/widgets/alchimia-header";
import { LessonOutline } from "~/widgets/lesson-outline";
import { LessonPracticeFlow } from "~/widgets/lesson-practice-flow";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { createLocalPracticeChecker } from "~/features/lesson-practice";
import { CatalogLayout } from "./catalog-layout";
import { practiceTasks, widgetSections } from "./design-system-lab.constants";
import styles from "./design-system-lab.module.css";

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
      <ul className={styles.nameGrid} aria-label="Виджеты навигации приложения">
        <li>
          <code>AlchimiaHeader</code>
        </li>
        <li>
          <code>PublicHeader</code>
        </li>
        <li>
          <code>PublicFooter</code>
        </li>
      </ul>
      <div className={styles.widgetSpecimen}>
        <code className={styles.typeTag}>ALCHIMIA · candidate header</code>
        <div className={styles.widgetCanvas}>
          <AlchimiaHeader home />
        </div>
      </div>
      <div className={styles.widgetSpecimen}>
        <code className={styles.typeTag}>infraege · current public chrome</code>
        <div className={`${styles.widgetCanvas} ${styles.productionPreview}`}>
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
      <ul className={styles.nameGrid} aria-label="Виджеты навигации урока">
        <li>
          <code>LessonOutline</code>
        </li>
      </ul>
      <div className={styles.outlineSpecimen}>
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
      <ul className={styles.nameGrid} aria-label="Виджеты учебного flow">
        <li>
          <code>LessonPracticeFlow</code>
        </li>
      </ul>
      <Typography.Text className={styles.placeholder}>
        Виджет соединяет публичный feature <code>LessonPractice</code> с
        локальным progress store. Внутренние части формы не становятся
        самостоятельными контрактами каталога.
      </Typography.Text>
      <LessonPracticeFlow
        checkAnswer={createLocalPracticeChecker(practiceTasks)}
        lessonId="design-system-lab"
        tasks={practiceTasks}
      />
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
      <div
        className={styles.layoutDiagram}
        aria-label="Схема публичной страницы"
      >
        <span>PublicHeader</span>
        <span>Page content</span>
        <span>PublicFooter</span>
      </div>
      <div className={styles.layoutDiagram} aria-label="Схема страницы урока">
        <span>Header</span>
        <span>LessonOutline + reading stream</span>
        <span>LessonPracticeFlow</span>
      </div>
    </section>
  </CatalogLayout>
);
