import { CircleCheck } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { Link } from "@tanstack/react-router";
import {
  Checkpoint,
  Diagram,
  Mistake,
  Procedure,
  WorkedExample,
} from "~/entities/lesson";
import {
  createLocalPracticeChecker,
  LessonPractice,
} from "~/features/lesson-practice";
import { createLessonProgressStore } from "~/features/lesson-progress";
import { Badge } from "~/shared/components/badge";
import { Accordion } from "~/shared/components/accordion";
import { ActionLink } from "~/shared/components/action-link";
import { Button } from "~/shared/components/button";
import { Callout } from "~/shared/components/callout";
import { CodeBlock } from "~/shared/components/code-block";
import { Divider } from "~/shared/components/divider";
import { EmptyState } from "~/shared/components/empty-state";
import { ExternalLink } from "~/shared/components/external-link";
import { Field } from "~/shared/components/field";
import { FragmentLink } from "~/shared/components/fragment-link";
import { Image } from "~/shared/components/image";
import { Notation } from "~/shared/components/notation";
import { PageContainer } from "~/shared/components/page-container";
import { Progress } from "~/shared/components/progress";
import {
  TabsList,
  TabsPanel,
  TabsRoot,
  TabsTab,
} from "~/shared/components/tabs";
import { Typography } from "~/shared/components/typography";
import { enhancementState } from "~/shared/lib/enhancement-state";
import {
  catalogNavigation,
  colorTokens,
  fontTokens,
  practiceTasks,
  spacingTokens,
  tonalSteps,
} from "./design-system-lab.constants";
import styles from "./design-system-lab.module.css";

const practiceProgressStore = createLessonProgressStore({
  lessonId: "design-system-lab",
});

const longHeading =
  "Как найти количество путей из точки A в точку B, если движение разрешено только вправо и вниз";
const longParagraph =
  "Если условие остановки никогда не выполняется, вызовы продолжают накапливаться в стеке вызовов — каждый новый вызов ждёт результата следующего, и ни один из них не может завершиться, пока не завершится последний.";

export const DesignSystemLab: React.FC = () => {
  // Cache-busting key: forces a fresh network fetch (and a fresh "loading"
  // mount) instead of an instant cache hit, so the skeleton is actually
  // visible to click and watch rather than just documented in prose.
  const [loadingDemoKey, setLoadingDemoKey] = useState(0);
  const [feedbackTab, setFeedbackTab] = useState("validation");
  const enhanced = useSyncExternalStore(
    enhancementState.subscribe,
    enhancementState.getClientSnapshot,
    enhancementState.getServerSnapshot,
  );

  return (
    <div className={styles.page} data-enhanced={enhanced || undefined}>
      <header className={styles.header}>
        <Typography.Title order={1} className={styles.title}>
          Инженерная тетрадь
        </Typography.Title>
        <Typography.Text className={styles.lede}>
          Приватный каталог обязательного frontend-контракта: сменяемая тема,
          семантические примитивы и реальные учебные композиции.
        </Typography.Text>
      </header>

      <div className={styles.layout}>
        <aside className={styles.catalogNavigation}>
          <nav
            className={styles.catalogNavigationInner}
            aria-label="Разделы дизайн-системы"
          >
            <Typography.Text
              variant="caption"
              className={styles.catalogNavigationLabel}
            >
              Каталог
            </Typography.Text>
            <ol className={styles.catalogNavigationList}>
              {catalogNavigation.map((item, index) => (
                <li key={item.id}>
                  <Link to="/lab/design-system" hash={item.id}>
                    <span aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <main className={styles.content}>
          <section
            className={styles.section}
            id="foundations"
            aria-labelledby="colors-heading"
          >
            <Typography.Text variant="caption" className={styles.groupLabel}>
              01 · Foundations
            </Typography.Text>
            <Typography.Title
              order={2}
              id="colors-heading"
              className={styles.sectionHeading}
            >
              Нейтральные цветовые роли
            </Typography.Title>
            <ul className={styles.colorGrid}>
              {colorTokens.map((token) => (
                <li key={token.name} className={styles.colorItem}>
                  <span
                    className={styles.swatch}
                    style={{ background: `var(${token.name})` }}
                    aria-hidden="true"
                  />
                  <span className={styles.colorLabel}>{token.label}</span>
                  <code className={styles.colorVar}>{token.name}</code>
                </li>
              ))}
            </ul>
          </section>

          <section
            className={styles.section}
            aria-labelledby="elevation-heading"
          >
            <Typography.Title
              order={2}
              id="elevation-heading"
              className={styles.sectionHeading}
            >
              Поверхности и границы
            </Typography.Title>
            <Typography.Text className={styles.placeholder}>
              Иерархию создают только фон, тонкая граница и контраст текста.
              Контролы остаются плоскими; глубина зарезервирована для временных
              overlay-поверхностей.
            </Typography.Text>
            <Typography.Title order={3} className={styles.subheading}>
              Tonal (для статичного контента)
            </Typography.Title>
            <ul className={styles.tonalGrid}>
              {tonalSteps.map((token) => (
                <li key={token.name} className={styles.tonalItem}>
                  <span
                    className={styles.tonalSwatch}
                    style={{ background: `var(${token.name})` }}
                  />
                  <code className={styles.colorVar}>{token.name}</code>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section} aria-labelledby="motion-heading">
            <Typography.Title
              order={2}
              id="motion-heading"
              className={styles.sectionHeading}
            >
              Движение
            </Typography.Title>
            <Typography.Text className={styles.placeholder}>
              Цвет, border и progress используют один переход{" "}
              <code>140ms ease-out</code>. Motion не сообщает смысл в одиночку и
              отключается при <code>prefers-reduced-motion</code>.
            </Typography.Text>
          </section>

          <section className={styles.section} aria-labelledby="fonts-heading">
            <Typography.Title
              order={2}
              id="fonts-heading"
              className={styles.sectionHeading}
            >
              Шрифты
            </Typography.Title>
            <ul className={styles.fontList}>
              {fontTokens.map((token) => (
                <li key={token.name} className={styles.fontItem}>
                  <div className={styles.fontMeta}>
                    <span className={styles.fontLabel}>{token.label}</span>
                    <code className={styles.colorVar}>{token.name}</code>
                  </div>
                  <Typography.Text
                    className={styles.fontSample}
                    style={{ fontFamily: `var(${token.name})` }}
                  >
                    {token.sample}
                  </Typography.Text>
                </li>
              ))}
            </ul>
          </section>

          <section
            className={styles.section}
            id="primitives"
            aria-labelledby="typography-heading"
          >
            <Typography.Title
              order={2}
              id="typography-heading"
              className={styles.sectionHeading}
            >
              02 · Primitives
            </Typography.Title>

            <Typography.Title order={3} className={styles.subheading}>
              Заголовки
            </Typography.Title>
            <div className={styles.typeSamples}>
              {([1, 2, 3, 4, 5, 6] as const).map((order) => (
                <div className={styles.typeRow} key={order}>
                  <code className={styles.typeTag}>h{order}</code>
                  <Typography.Title order={order}>
                    Базовый случай и шаг рекурсии
                  </Typography.Title>
                </div>
              ))}
            </div>

            <Typography.Title order={3} className={styles.subheading}>
              Семантические роли текста
            </Typography.Title>
            <div className={styles.typeSamples}>
              {(["lead", "body", "interface", "caption"] as const).map(
                (role) => (
                  <div className={styles.typeRow} key={role}>
                    <code className={styles.typeTag}>text · {role}</code>
                    <Typography.Text variant={role}>
                      Каждый рекурсивный вызов приближает нас к базовому случаю
                      — без этого функция не завершится.
                    </Typography.Text>
                  </div>
                ),
              )}
              <div className={styles.typeRow}>
                <code className={styles.typeTag}>tone · muted</code>
                <Typography.Text tone="muted">
                  Задание 16 · ЕГЭ информатика
                </Typography.Text>
              </div>
              <div className={styles.typeRow}>
                <code className={styles.typeTag}>tone · accent</code>
                <Typography.Text tone="accent">
                  Правильный ответ засчитан
                </Typography.Text>
              </div>
              <div className={styles.typeRow}>
                <code className={styles.typeTag}>tone · highlight</code>
                <Typography.Text tone="highlight" component="span">
                  fib(n - 1)
                </Typography.Text>
              </div>
            </div>

            <Typography.Title order={3} className={styles.subheading}>
              Обрезка текста (узкий контейнер)
            </Typography.Title>
            <div className={styles.truncateGrid}>
              <div className={styles.truncateCard}>
                <code className={styles.typeTag}>Text · truncate</code>
                <div className={styles.narrowBox}>
                  <Typography.Text truncate>{longParagraph}</Typography.Text>
                </div>
              </div>
              <div className={styles.truncateCard}>
                <code className={styles.typeTag}>Text · lineClamp=2</code>
                <div className={styles.narrowBox}>
                  <Typography.Text lineClamp={2}>
                    {longParagraph}
                  </Typography.Text>
                </div>
              </div>
              <div className={styles.truncateCard}>
                <code className={styles.typeTag}>Title h3 · lineClamp=2</code>
                <div className={styles.narrowBox}>
                  <Typography.Title order={3} lineClamp={2}>
                    {longHeading}
                  </Typography.Title>
                </div>
              </div>
            </div>

            <Typography.Title order={3} className={styles.subheading}>
              Контейнеры
            </Typography.Title>
            <div className={styles.containerSamples}>
              <PageContainer
                component="div"
                measure="reading"
                className={styles.containerSample}
              >
                <code className={styles.typeTag}>measure · reading</code>
              </PageContainer>
              <PageContainer
                component="div"
                measure="wide"
                className={styles.containerSample}
              >
                <code className={styles.typeTag}>measure · wide</code>
              </PageContainer>
              <PageContainer
                component="div"
                measure="full"
                className={styles.containerSample}
              >
                <code className={styles.typeTag}>measure · full</code>
              </PageContainer>
            </div>

            <Typography.Title order={3} className={styles.subheading}>
              Кнопки и бейджи
            </Typography.Title>
            <div className={styles.controlsRow}>
              <Button>Проверить ответ</Button>
              <Button hierarchy="secondary">Показать решение</Button>
              <Button hierarchy="quiet">Тихое действие</Button>
              <Button density="compact">Компактная кнопка</Button>
              <Button loading>Проверяем</Button>
              <Button hierarchy="secondary" disabled>
                Недоступно
              </Button>
              <ActionLink to="/" hierarchy="secondary">
                На главную
              </ActionLink>
              <ActionLink to="/" hierarchy="quiet">
                Тихая ссылка
              </ActionLink>
              <Badge tone="accent">Задание 16</Badge>
              <Badge>Разбор</Badge>
              <Badge tone="neutral">1 / 5</Badge>
              <Badge tone="success" icon={<CircleCheck size={12} />}>
                решено
              </Badge>
              <Badge tone="accent">Средняя</Badge>
              <span className={styles.narrowBadge}>
                <Badge fullWidth>
                  Очень длинное название бейджа, которое не помещается
                </Badge>
              </span>
            </div>

            <Typography.Text component="div" className={styles.placeholder}>
              <Notation kind="code">countdown(n)</Notation> — код-фрагмент
              (моноширинный шрифт); <Notation kind="formula">M</Notation> —
              алгоритмическая переменная (читательская гарнитура, без курсива).
              Общий чип из <code>shared/components/notation</code> вместо
              копирования CSS в каждый компонент теории.
            </Typography.Text>
          </section>

          <section className={styles.section} aria-labelledby="spacing-heading">
            <Typography.Title
              order={2}
              id="spacing-heading"
              className={styles.sectionHeading}
            >
              Отступы
            </Typography.Title>
            <ul className={styles.spacingList}>
              {spacingTokens.map((token) => (
                <li key={token.name} className={styles.spacingItem}>
                  <code className={styles.colorVar}>{token.name}</code>
                  <span
                    className={styles.spacingBar}
                    style={{ width: `var(${token.name})` }}
                  />
                </li>
              ))}
            </ul>
          </section>

          <section
            className={styles.section}
            id="feedback-disclosure"
            aria-labelledby="components-heading"
          >
            <Typography.Title
              order={2}
              id="components-heading"
              className={styles.sectionHeading}
            >
              03 · Feedback &amp; Disclosure
            </Typography.Title>
            <div className={styles.componentGroup}>
              <code className={styles.typeTag}>
                Callout · tone=&quot;idea&quot;
              </code>
              <Callout
                tone="idea"
                title="Базовый случай — это выход, а не формальность"
              >
                <Typography.Text>
                  Пока рекурсия не достигнет базового случая, вызовы продолжают
                  накапливаться в стеке. Формулировка базового случая — первое,
                  что стоит проверять при отладке.
                </Typography.Text>
              </Callout>
            </div>

            <div className={styles.componentGroup}>
              <code className={styles.typeTag}>
                Callout · tone=&quot;warning&quot;
              </code>
              <Callout
                tone="warning"
                title="Без базового случая — бесконечная рекурсия"
              >
                <Typography.Text>
                  Если условие остановки никогда не выполняется, вызовы растут,
                  пока не переполнится стек вызовов (<code>RecursionError</code>{" "}
                  в Python).
                </Typography.Text>
              </Callout>
            </div>

            <div className={styles.componentGroup}>
              <code className={styles.typeTag}>
                Callout · density=&quot;dense&quot;
              </code>
              <Callout
                tone="idea"
                density="dense"
                title="Компактный вариант для маргиналий"
              >
                <Typography.Text>
                  Меньше отступов и размер текста поменьше — для мест, где
                  Callout соседствует с другим содержимым, а не стоит один в
                  потоке чтения.
                </Typography.Text>
              </Callout>
            </div>

            <Typography.Title order={3} className={styles.subheading}>
              Поля и валидация
            </Typography.Title>
            <div className={styles.feedbackGrid}>
              <Field
                label="Ответ"
                description="Введите целое число без пробелов."
                name="field-default-demo"
                placeholder="Например, 4"
              />
              <Field
                label="Ответ с ошибкой"
                description="Значение сохраняется после неудачной проверки."
                error="Ответ должен быть целым числом."
                name="field-invalid-demo"
                defaultValue="четыре вызова"
              />
              <Field
                label="Недоступное поле"
                description="Состояние понятно не только по цвету."
                name="field-disabled-demo"
                defaultValue="Ответ уже принят"
                disabled
              />
            </div>

            <Typography.Title order={3} className={styles.subheading}>
              Прогресс
            </Typography.Title>
            <div className={styles.progressGrid}>
              <div>
                <Typography.Text variant="caption">
                  3 из 5 задач
                </Typography.Text>
                <Progress
                  label="Прогресс темы"
                  max={5}
                  value={3}
                  valueText="Решено 3 из 5 задач"
                />
              </div>
              <div>
                <Typography.Text variant="caption">Завершено</Typography.Text>
                <Progress
                  label="Прогресс темы завершён"
                  max={5}
                  value={5}
                  valueText="Решено 5 из 5 задач"
                />
              </div>
              <div>
                <Typography.Text variant="caption">Проверка</Typography.Text>
                <Progress label="Проверяем ответ" value={null} />
              </div>
            </div>

            <Typography.Title order={3} className={styles.subheading}>
              Раскрытие
            </Typography.Title>
            <Accordion
              multiple
              items={[
                {
                  id: "base-case",
                  title: "Что делает базовый случай?",
                  content:
                    "Останавливает цепочку новых вызовов и запускает возврат результатов.",
                },
                {
                  id: "recursive-step",
                  title: "Что меняется на рекурсивном шаге?",
                  content:
                    "Аргумент приближается к базовому случаю, иначе вычисление не завершится.",
                },
              ]}
            />

            <Typography.Title order={3} className={styles.subheading}>
              Вкладки
            </Typography.Title>
            <TabsRoot
              className={styles.tabsDemo}
              value={feedbackTab}
              onValueChange={setFeedbackTab}
            >
              <TabsList label="Пример состояний" hidden={!enhanced}>
                <TabsTab value="validation">Валидация</TabsTab>
                <TabsTab value="empty">Пустое состояние</TabsTab>
              </TabsList>
              <TabsPanel value="validation">
                <Typography.Text>
                  Ошибка появляется рядом с полем и связана с ним программно;
                  введённое значение не пропадает.
                </Typography.Text>
              </TabsPanel>
              <TabsPanel value="empty">
                <EmptyState
                  title="Практика ещё не начата"
                  description="Решите первую задачу, и здесь появится прогресс темы."
                  action={<Button>Начать практику</Button>}
                />
              </TabsPanel>
            </TabsRoot>
            <div className={styles.componentGroup}>
              <code className={styles.typeTag}>
                ExternalLink / FragmentLink
              </code>
              <Typography.Text className={styles.placeholder}>
                Стрелка направо-вверх помечает уход с сайта; иконка цепи —
                переход внутри страницы. Текст и подчёркивание остаются
                нейтральными: ссылка заметна сразу за счёт постоянного
                underline, а hover/focus усиливают контраст без появления
                декоративного цвета.
              </Typography.Text>
              <Typography.Text component="div">
                Например, смотрите официальную{" "}
                <ExternalLink href="https://docs.python.org/3/" newTab>
                  документацию Python
                </ExternalLink>{" "}
                или сразу переходите{" "}
                <FragmentLink hash="worked-example-demo">
                  к разобранному примеру ниже
                </FragmentLink>
                .
              </Typography.Text>
            </div>

            <Typography.Title
              order={2}
              id="lesson-patterns"
              className={styles.groupHeading}
            >
              04 · Lesson Patterns
            </Typography.Title>
            <Typography.Text className={styles.placeholder}>
              Паттерны различаются ролью в объяснении, а не декоративным цветом:
              последовательность, правило, опровержение, исполняемая запись,
              визуальное доказательство и самопроверка образуют разные ритмы
              внутри одной страницы урока.
            </Typography.Text>
            <Typography.Title order={3} className={styles.patternHeading}>
              Разбор, алгоритм и опровержение
            </Typography.Title>
            <div className={styles.componentGroup} id="worked-example-demo">
              <code className={styles.typeTag}>WorkedExample</code>
              <WorkedExample
                title="Сколько раз вызовется countdown(3)?"
                prompt={
                  <>
                    <code>countdown(n)</code> вызывает{" "}
                    <code>countdown(n - 1)</code>, пока <code>n</code> не станет
                    0.
                  </>
                }
                steps={[
                  <>
                    <code>countdown(3)</code> вызывает <code>countdown(2)</code>{" "}
                    и ждёт его результата.
                  </>,
                  <>
                    <code>countdown(2)</code> вызывает <code>countdown(1)</code>{" "}
                    и ждёт его результата.
                  </>,
                  <>
                    <code>countdown(1)</code> вызывает <code>countdown(0)</code>{" "}
                    и ждёт его результата.
                  </>,
                  <>
                    <code>countdown(0)</code> — базовый случай: вызовов больше
                    не делает, возвращается сразу.
                  </>,
                  <>
                    Итого 4 вызова: <code>countdown(3)</code>,{" "}
                    <code>countdown(2)</code>, <code>countdown(1)</code>,{" "}
                    <code>countdown(0)</code>.
                  </>,
                ]}
              />
            </div>

            <div className={styles.componentGroup}>
              <code className={styles.typeTag}>Procedure</code>
              <Procedure
                title="Как спроектировать рекурсивную функцию"
                steps={[
                  {
                    label: "Определите базовый случай.",
                    detail: (
                      <>
                        Вход, для которого ответ известен без{" "}
                        <code>рекурсивного вызова</code>.
                      </>
                    ),
                  },
                  {
                    label: "Определите рекурсивный случай.",
                    detail: (
                      <>
                        Выразите ответ через вызов той же функции с входом,
                        который <em>приближается</em> к базовому случаю.
                      </>
                    ),
                  },
                  {
                    label: "Проверьте функцию на базовом случае.",
                    detail:
                      "На входе, совпадающем с базовым случаем, она должна вернуть ответ без единого рекурсивного вызова.",
                  },
                ]}
              />
            </div>

            <div className={styles.componentGroup}>
              <code className={styles.typeTag}>Mistake</code>
              <Mistake
                claim={<>Каждый рекурсивный вызов ускоряет работу программы.</>}
                explanation={
                  <>
                    Наоборот: каждый вызов добавляет кадр в{" "}
                    <code>стек вызовов</code> и ждёт результата вложенного —
                    рекурсия обычно медленнее и затратнее по памяти, чем
                    эквивалентный цикл. Выигрыш рекурсии — в ясности кода для
                    задач с естественной рекурсивной структурой, а не в
                    скорости.
                  </>
                }
              />
            </div>

            <Typography.Title order={3} className={styles.patternHeading}>
              Код и вычислительные записи
            </Typography.Title>
            <div className={styles.componentGroup}>
              <code className={styles.typeTag}>
                CodeBlock · language=&quot;python&quot;
              </code>
              <CodeBlock
                code={`def countdown(n):\n    if n == 0:\n        return\n    print(n)\n    countdown(n - 1)`}
                label="Пример: countdown"
                language="python"
              />
            </div>

            <div className={styles.componentGroup}>
              <code className={styles.typeTag}>
                CodeBlock · language=&quot;python&quot; · showLineNumbers
              </code>
              <CodeBlock
                code={`def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)`}
                label="Пример: factorial с нумерацией строк"
                language="python"
                showLineNumbers
              />
            </div>

            <div className={styles.componentGroup}>
              <code className={styles.typeTag}>
                CodeBlock · language=&quot;text&quot;
              </code>
              <Typography.Text className={styles.placeholder}>
                Тот же корпус, что и у Python-примера, но без подсветки
                синтаксиса и с подписью «запись» — для трасс вычисления, формул
                в промежуточном виде и списков значений, которые часто
                соседствуют с кодом в тексте урока.
              </Typography.Text>
              <CodeBlock
                code={`F(5) = 2 · F(4) + 1\nF(4) = 2 · F(3) + 1\nF(3) = 2 · F(2) + 1\nF(2) = 2 · F(1) + 1\nF(1) = 1`}
                label="Запись: раскрытие рекурсивной формулы"
                language="text"
              />
            </div>

            <Typography.Title order={3} className={styles.patternHeading}>
              Схемы и сопровождающие материалы
            </Typography.Title>
            <div className={styles.componentGroup}>
              <code className={styles.typeTag}>
                Diagram · placement=&quot;figure&quot;
              </code>
              <Diagram
                src="/diagrams/bst-subtrees.png"
                alt="Двоичное дерево поиска с корнем 10: слева поддерево со значениями меньше 10, справа — со значениями больше 10."
                caption="Свойство двоичного дерева поиска"
                purpose="Показать смысл обычной учебной иллюстрации с подписью"
              />
            </div>

            <div className={styles.componentGroup}>
              <code className={styles.typeTag}>
                Diagram · placement=&quot;annotated&quot; · pointers → leaders →
                заметки в боковых полях
              </code>
              <Diagram
                placement="annotated"
                src="/diagrams/bst-subtrees.png"
                alt="Двоичное дерево поиска с корнем 10: слева поддерево со значениями меньше 10 (5, 2, 7), справа — со значениями больше 10 (20, 25)."
                caption="Свойство двоичного дерева поиска"
                purpose="Показать, почему поиск отбрасывает половину узлов на каждом шаге"
                pointers={[
                  {
                    id: "left",
                    x: 27,
                    y: 54,
                    side: "left",
                    note: "Левое поддерево — гарантированно меньше корня.",
                  },
                  {
                    id: "root",
                    x: 48,
                    y: 14,
                    side: "right",
                    note: "Корень: все сравнения начинаются здесь.",
                  },
                  {
                    id: "right",
                    x: 69,
                    y: 54,
                    side: "right",
                    note: "Правое поддерево — гарантированно больше корня.",
                  },
                ]}
              />
            </div>

            <div className={styles.componentGroup}>
              <code className={styles.typeTag}>
                Diagram · placement=&quot;float-right&quot; · footnotes ·
                детальное пояснение слева
              </code>
              <div className={styles.floatDemo}>
                <Diagram
                  placement="float-right"
                  src="/diagrams/bst-subtrees.png"
                  alt="Двоичное дерево поиска с корнем 10: слева поддерево со значениями меньше 10, справа — со значениями больше 10."
                  caption="Свойство двоичного дерева поиска"
                  purpose="Связать правило поиска с устройством дерева"
                  footnotes={[
                    {
                      id: "order",
                      text: "Одно сравнение с корнем исключает целое поддерево.",
                    },
                  ]}
                />
                <Typography.Text component="div">
                  Когда концепту нужно полноценное объяснение, а не подпись,
                  Diagram уходит вправо маргиналией, а само объяснение остаётся
                  обычным читаемым текстом здесь, слева — того же размера, что и
                  остальная теория урока, а не сжатым до dense-подписи под
                  картинкой. В двоичном дереве поиска значения меньше корня
                  находятся слева, а большие — справа. Поэтому после одного
                  сравнения алгоритм продолжает поиск только в подходящем
                  поддереве.
                </Typography.Text>
              </div>
            </div>

            <Typography.Title order={3} className={styles.patternHeading}>
              Переходы и самопроверка
            </Typography.Title>
            <div className={styles.componentGroup}>
              <code className={styles.typeTag}>Image · состояния</code>
              <Typography.Text className={styles.placeholder}>
                Слева направо: загрузка (кнопка форсирует новый сетевой запрос —
                на локальном сервере скелетон виден кратко, дольше на медленном
                соединении), успешно загруженное, информативное с ошибкой (
                <code>role=&quot;img&quot;</code> + <code>aria-label</code>),
                декоративное с ошибкой (то же состояние, но{" "}
                <code>aria-hidden</code> убирает его из дерева доступности) и
                восстановление через <code>fallbackSrc</code> после ошибки
                основного источника.
              </Typography.Text>
              <div className={styles.imageDemoRow}>
                <div className={styles.imageDemoBox}>
                  <Image
                    key={loadingDemoKey}
                    src={`/diagrams/bst-subtrees.png?demo=${String(loadingDemoKey)}`}
                    alt="Двоичное дерево для демонстрации состояния загрузки"
                    width={812}
                    height={390}
                  />
                  <Button
                    density="compact"
                    hierarchy="quiet"
                    type="button"
                    onClick={() => {
                      setLoadingDemoKey((key) => key + 1);
                    }}
                  >
                    Показать загрузку ещё раз
                  </Button>
                </div>
                <div className={styles.imageDemoBox}>
                  <Image
                    src="/diagrams/bst-subtrees.png"
                    alt="Двоичное дерево поиска"
                    width={812}
                    height={390}
                  />
                </div>
                <div className={styles.imageDemoBox}>
                  <Image
                    src="/diagrams/does-not-exist.png"
                    alt="Схема, которая не загрузится"
                  />
                </div>
                <div className={styles.imageDemoBox}>
                  <Image src="/diagrams/does-not-exist.png" decorative />
                </div>
                <div className={styles.imageDemoBox}>
                  <Image
                    src="/diagrams/does-not-exist.png"
                    fallbackSrc="/diagrams/bst-subtrees.png"
                    alt="Схема с рабочим fallbackSrc"
                    width={812}
                    height={390}
                  />
                </div>
              </div>
            </div>

            <div className={styles.componentGroup}>
              <code className={styles.typeTag}>
                Divider · purpose=&quot;section&quot;
              </code>
              <Divider />
            </div>

            <div className={styles.componentGroup}>
              <code className={styles.typeTag}>
                Divider · purpose=&quot;comparison&quot;
              </code>
              <Divider purpose="comparison" />
            </div>

            <div className={styles.componentGroup}>
              <code className={styles.typeTag}>Divider · dashed</code>
              <Divider dashed />
            </div>

            <div className={styles.componentGroup}>
              <code className={styles.typeTag}>
                Divider · purpose=&quot;comparison&quot; dashed
              </code>
              <Divider purpose="comparison" dashed />
            </div>

            <div className={styles.componentGroup}>
              <code className={styles.typeTag}>Checkpoint</code>
              <Typography.Text className={styles.placeholder}>
                Без JavaScript вопросы и ответы остаются в линейном потоке.
                После общего <code>data-enhanced</code> Base UI сможет включить
                единый disclosure-контракт без дублирования содержимого.
              </Typography.Text>
              <Checkpoint
                items={[
                  {
                    id: "base-case",
                    prompt:
                      "Что произойдёт, если в рекурсивной функции забыть условие базового случая?",
                    reveal:
                      "Вызовы будут накапливаться в стеке вызовов бесконечно, пока не произойдёт переполнение стека (RecursionError в Python).",
                  },
                  {
                    id: "calls-count",
                    prompt: (
                      <>
                        Сколько раз вызовется <code>countdown(3)</code>, если{" "}
                        <code>countdown(n)</code> вызывает{" "}
                        <code>countdown(n - 1)</code> до <code>n == 0</code>?
                      </>
                    ),
                    reveal: (
                      <>
                        4 раза: <code>countdown(3)</code>,{" "}
                        <code>countdown(2)</code>, <code>countdown(1)</code>,{" "}
                        <code>countdown(0)</code>.
                      </>
                    ),
                  },
                ]}
              />
            </div>
          </section>

          <section
            className={styles.section}
            id="composite-flows"
            aria-labelledby="practice-heading"
          >
            <Typography.Title
              order={2}
              id="practice-heading"
              className={styles.sectionHeading}
            >
              05 · Composite Flows
            </Typography.Title>
            <Typography.Text className={styles.placeholder}>
              Реальный <code>LessonPractice</code> соединяет форму ответа,
              обратную связь, навигацию по задачам и локальный progress store.
              Секция ниже проверяет композицию целиком: от выбора сложности до
              ошибки, подсказки, успешного ответа и перехода к результату.
            </Typography.Text>
            <LessonPractice
              checkAnswer={createLocalPracticeChecker(practiceTasks)}
              progressStore={practiceProgressStore}
              tasks={practiceTasks}
            />
          </section>
        </main>
      </div>
    </div>
  );
};
