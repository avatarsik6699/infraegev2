import { useState } from "react";
import { EmptyState } from "~/shared/components/empty-state";
import { practiceUxFixtures } from "./practice-ux-fixtures";
import { SelectField } from "~/shared/components/select-field";
import { Typography } from "~/shared/components/typography";
import { ActionLink } from "~/shared/components/action-link";
import { StandalonePracticeSpecimen } from "./standalone-practice-specimen";
import styles from "./practice-ux-specimen.module.css";

const practiceUxSpecimen = {
  examples: [
    {
      label: "Все показатели",
      time: "≈ 8 минут",
      stats: "Решили 1 240 человек · Верных первых попыток — 68%",
    },
    { label: "Без показателей", time: null, stats: null },
    { label: "Частичные данные", time: "≈ 8 минут", stats: null },
    {
      label: "Длинные значения",
      time: "≈ 120 минут",
      stats: "Решили 1 240 000 человек · Верных первых попыток — 100%",
    },
  ],
};

export const PracticeUxSpecimen: React.FC = () => {
  const [example, setExample] = useState("formula");
  return (
    <section
      className={styles.specimen}
      id="practice-ux"
      aria-label="Каталог и решение задач"
    >
      <Typography.Title order={3}>Каталог и решение задач</Typography.Title>
      <Typography.Text tone="muted">
        Демонстрационные данные — для оценки интерфейса
      </Typography.Text>
      <div className={styles.list}>
        {practiceUxSpecimen.examples.map((example) => (
          <article key={example.label} className={styles.row}>
            <Typography.Text variant="caption" tone="muted">
              {example.label}
            </Typography.Text>
            <Typography.Title order={4}>
              Разность значений рекурсивной функции
            </Typography.Title>
            <Typography.Text>
              Функция задана рекуррентным соотношением. Найдите разность двух её
              значений.
            </Typography.Text>
            <Typography.Text variant="caption" tone="muted">
              №16 · Базовая{example.time ? ` · ${example.time}` : ""}
            </Typography.Text>
            {example.stats && (
              <Typography.Text variant="caption" tone="muted">
                {example.stats}
              </Typography.Text>
            )}
          </article>
        ))}
      </div>
      <SelectField
        label="Сценарий задачи"
        value={example}
        onChange={(event) => setExample(event.target.value)}
        options={[
          { value: "formula", label: "Короткая формула" },
          { value: "code", label: "Языки программирования" },
          { value: "long", label: "Длинное условие и файл" },
          { value: "failure", label: "Ошибка проверки" },
        ]}
      />
      <Typography.Text variant="caption" tone="muted">
        ≈ 8 минут · Решили 1 240 человек — демонстрационные показатели задачи
      </Typography.Text>
      <StandalonePracticeSpecimen
        key={example}
        task={practiceUxFixtures[example] ?? practiceUxFixtures.formula}
        serviceFailure={example === "failure"}
      />
      <EmptyState
        title="Задачи пока не опубликованы"
        description="Практические задания доступны внутри уроков."
      />
      <EmptyState
        title="По этим фильтрам задач пока нет"
        description="Снимите ограничения, чтобы увидеть другие задачи."
      />
      <div role="alert">
        <Typography.Title order={4}>
          Не удалось загрузить задачи
        </Typography.Title>
        <Typography.Text>Попробуйте ещё раз немного позже.</Typography.Text>
      </div>
      <ActionLink to="/practice" hierarchy="drawn">
        Открыть реальный каталог
      </ActionLink>
    </section>
  );
};
