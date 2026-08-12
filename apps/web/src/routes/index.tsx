import { createFileRoute } from "@tanstack/react-router";
import { LearningPathTableOfContents } from "~/shared/components/learning-path-table-of-contents";
import { PageContainer } from "~/shared/components/page-container";
import styles from "./index.module.css";

const sections = [
  {
    id: "theory",
    label: "Теория",
    description: "Идея, объяснение и учебные визуалы",
  },
  {
    id: "practice",
    label: "Практика",
    description: "Алгоритм, пример и задачи",
  },
  {
    id: "exam-focus",
    label: "Что важно для ЕГЭ",
    description: "Ошибки, требования и подсказки",
  },
  {
    id: "result",
    label: "Результат",
    description: "Итоги и следующий шаг",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Учебный маршрут — UI foundation" }] }),
  component: FoundationRoute,
});

function FoundationRoute() {
  return (
    <PageContainer size="68rem" className={styles.root}>
      <h1 className={styles.visuallyHidden}>Стенд учебного маршрута</h1>
      <nav className={styles.navigation} aria-label="Оглавление">
        <LearningPathTableOfContents
          items={sections}
          targetSelector="[data-foundation-section]"
          offset={32}
        />
      </nav>
      <div className={styles.targets} aria-label="Разделы учебного маршрута">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className={styles.section}
            data-foundation-section
            data-learning-label={section.label}
          >
            <h2>{section.label}</h2>
            <p>{section.description}</p>
          </section>
        ))}
      </div>
    </PageContainer>
  );
}
