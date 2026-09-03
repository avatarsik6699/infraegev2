import { CircleCheck } from "lucide-react";
import { useState } from "react";
import { LearningVisualFrame } from "~/entities/learning-visual";
import {
  createLocalPracticeChecker,
  LessonPractice,
} from "~/features/lesson-practice";
import { LessonProgress } from "~/features/lesson-progress";
import { Accordion } from "~/shared/components/accordion";
import { ActionLink } from "~/shared/components/action-link";
import { BackLink } from "~/shared/components/back-link";
import { Badge } from "~/shared/components/badge";
import { Button } from "~/shared/components/button";
import { Callout } from "~/shared/components/callout";
import { CodeBlock } from "~/shared/components/code-block";
import { ConfirmationDialog } from "~/shared/components/confirmation-dialog";
import { DownloadLink } from "~/shared/components/download-link";
import { EmptyState } from "~/shared/components/empty-state";
import { ExternalLink } from "~/shared/components/external-link";
import { Field } from "~/shared/components/field";
import { FragmentLink } from "~/shared/components/fragment-link";
import { Image } from "~/shared/components/image";
import { Input } from "~/shared/components/input";
import {
  Checkpoint,
  Diagram,
  LessonIntro,
  LessonSectionHeading,
  LessonTheory,
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
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
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { CatalogLayout } from "./catalog-layout";
import {
  CatalogContractMap,
  type CatalogContract,
} from "./catalog-contract-map";
import { ControlSpecimen } from "./control-specimen";
import {
  componentErrorPracticeTasks,
  componentPracticeTasks,
  componentSections,
} from "./design-system-lab.constants";
import styles from "./design-system-lab.module.css";

const brokenImageSource = "data:image/png;base64,aW52YWxpZA==";
const longHeading =
  "Как найти количество путей из точки A в точку B, если движение разрешено только вправо и вниз";
const longParagraph =
  "Если условие остановки никогда не выполняется, вызовы продолжают накапливаться в стеке вызовов — каждый новый вызов ждёт результата следующего.";

const live = (name: string, note: string): CatalogContract => ({
  name,
  note,
  status: "live",
});

const context = (name: string, note: string): CatalogContract => ({
  name,
  note,
  status: "context",
});

const componentContracts = {
  content: [
    live("Typography", "Текстовые роли и ограничение строк"),
    live("PageContainer", "Три смысловые ширины контента"),
    live("Notation", "Кодовая и формульная запись"),
  ],
  actions: [
    live("Button", "Иерархия, плотность, loading и disabled"),
    live("ActionLink", "Кнопочное или текстовое навигационное действие"),
    live("BackLink", "Возврат с безопасным fallback"),
    live("ExternalLink", "Внешний переход с явным поведением"),
    live("FragmentLink", "Переход к разделу текущей страницы"),
    live("ConfirmationDialog", "Подтверждение необратимого действия"),
    live("DownloadLink", "Скачивание локального authored-файла"),
  ],
  input: [
    live("Input", "Самостоятельное поле ввода"),
    live("Field", "Подпись, описание, ошибка и disabled"),
    live("Accordion", "Раскрытие пояснений на месте"),
    live("TabsRoot", "Владелец выбранного состояния"),
    live("TabsList", "Семантический список вкладок"),
    live("TabsTab", "Доступный интерактивный переключатель"),
    live("TabsPanel", "Связанная область содержимого"),
  ],
  feedback: [
    live("Badge", "Нейтральные и функциональные статусы"),
    live("Progress", "Определённый и неопределённый процесс"),
    live("Callout", "Пояснение и предупреждение"),
    live("EmptyState", "Пустое состояние со следующим действием"),
  ],
  media: [
    live("CodeBlock", "Код и текстовая запись"),
    live("Image", "Загрузка, ошибка и fallback"),
  ],
  learning: [
    live("Checkpoint", "Проверка понимания с раскрываемым ответом"),
    live("Diagram", "Изображение с учебной подписью"),
    live("LearningVisualFrame", "Рамка визуала с текстовой альтернативой"),
    live("LessonIntro", "Заголовок и метаданные урока"),
    live("LessonSectionHeading", "Нумерованный заголовок учебного раздела"),
    live("LessonTheory", "Линейный поток понятий"),
    live("Mistake", "Сравнение ошибочного и правильного рассуждения"),
    live("Procedure", "Последовательность действий"),
    live("WorkedExample", "Пошаговый разбор"),
  ],
  features: [
    context(
      "AnalyticsConsentControl",
      "Читает и изменяет реальное согласие браузера",
    ),
    context("AnalyticsConsentPrompt", "Владеет согласием и запуском аналитики"),
    live("LessonPractice", "Локальная проверка без progress store и сети"),
    live("LessonProgress", "Чистое представление переданного прогресса"),
    context(
      "ReadingPositionIndicator",
      "Наблюдает за scroll-target страницы урока",
    ),
  ],
} as const;

export const ComponentsCatalog: React.FC = () => {
  const [feedbackTab, setFeedbackTab] = useState("validation");
  const [loadingDemoKey, setLoadingDemoKey] = useState(0);
  const enhanced = useIsEnhanced();

  return (
    <CatalogLayout
      title="Компоненты"
      description="Самостоятельные публичные UI-контракты из shared, entities и features. Группировка отражает пользовательский смысл, а не расположение файла в архитектурном слое."
      sections={componentSections}
    >
      <section
        className={styles.section}
        id="components-content"
        aria-labelledby="components-content-heading"
      >
        <Typography.Title
          order={3}
          id="components-content-heading"
          className={styles.patternHeading}
        >
          Текст и структура
        </Typography.Title>
        <CatalogContractMap
          contracts={componentContracts.content}
          label="Контракты текста и структуры"
        />
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
              <Typography.Text lineClamp={2}>{longParagraph}</Typography.Text>
            </div>
          </div>
          <div className={styles.truncateCard}>
            <code className={styles.typeTag}>Title · lineClamp=2</code>
            <div className={styles.narrowBox}>
              <Typography.Title order={4} lineClamp={2}>
                {longHeading}
              </Typography.Title>
            </div>
          </div>
        </div>
        <div className={styles.containerSamples}>
          {(["reading", "wide", "full"] as const).map((measure) => (
            <PageContainer
              key={measure}
              component="div"
              measure={measure}
              className={styles.containerSample}
            >
              <code className={styles.typeTag}>measure · {measure}</code>
            </PageContainer>
          ))}
        </div>
        <Typography.Text component="div" className={styles.placeholder}>
          <Notation kind="code">countdown(n)</Notation> — код;{" "}
          <Notation kind="formula">M</Notation> — алгоритмическая переменная.
        </Typography.Text>
      </section>

      <section
        className={styles.section}
        id="components-actions"
        aria-labelledby="components-actions-heading"
      >
        <Typography.Title
          order={3}
          id="components-actions-heading"
          className={styles.patternHeading}
        >
          Действия и навигация
        </Typography.Title>
        <CatalogContractMap
          contracts={componentContracts.actions}
          label="Контракты действий и навигации"
        />
        <ControlSpecimen
          kind="controls"
          title="Иерархия действий"
          description="Одно основное действие ведёт группу; вторичные и тихие варианты не спорят с ним за внимание."
        >
          <div className={styles.controlsRow}>
            <Button>Проверить ответ</Button>
            <Button hierarchy="secondary">Показать решение</Button>
            <Button hierarchy="quiet">Тихое действие</Button>
            <Button density="compact" hierarchy="secondary">
              Компактная кнопка
            </Button>
            <ActionLink to="/" hierarchy="secondary">
              На главную
            </ActionLink>
            <ActionLink to="/" hierarchy="quiet">
              Тихая ссылка
            </ActionLink>
            <ActionLink to="/" hierarchy="text" icon="forward">
              Следующий урок
            </ActionLink>
            <BackLink fallbackTo="/">Вернуться</BackLink>
            <DownloadLink href="/content/tasks/python-files-aggregate/numbers.txt">
              Скачать пример
            </DownloadLink>
            {enhanced ? (
              <span data-component-specimen="ConfirmationDialog">
                <ConfirmationDialog
                  triggerLabel="Сбросить пример"
                  title="Сбросить пример?"
                  description="Это демонстрационное подтверждение не изменяет данные."
                  confirmLabel="Сбросить"
                  onConfirm={() => undefined}
                />
              </span>
            ) : null}
          </div>
          <Typography.Text component="div">
            <ExternalLink href="https://docs.python.org/3/" newTab>
              Документация Python
            </ExternalLink>{" "}
            и{" "}
            <FragmentLink hash="components-learning">
              учебные компоненты
            </FragmentLink>
            .
          </Typography.Text>
        </ControlSpecimen>
        <ControlSpecimen
          kind="states"
          title="Состояния действия"
          description="Загрузка сообщает о процессе, а disabled-состояние сохраняет подпись и форму контрола."
        >
          <div className={styles.controlsRow}>
            <Button loading>Проверяем</Button>
            <Button hierarchy="secondary" disabled>
              Недоступно
            </Button>
          </div>
        </ControlSpecimen>
      </section>

      <section
        className={styles.section}
        id="components-input"
        aria-labelledby="components-input-heading"
      >
        <Typography.Title
          order={3}
          id="components-input-heading"
          className={styles.patternHeading}
        >
          Ввод и раскрытие
        </Typography.Title>
        <CatalogContractMap
          contracts={componentContracts.input}
          label="Контракты ввода и раскрытия"
        />
        <ControlSpecimen
          kind="states"
          title="Состояния поля"
          description="Обычное, ошибочное и недоступное состояния сохраняют одинаковую геометрию и объясняют изменение текстом."
        >
          <div className={styles.feedbackGrid}>
            <div className={styles.standaloneInputSpecimen}>
              <code>Input · без Field</code>
              <Input aria-label="Самостоятельный Input" placeholder="Input" />
            </div>
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
        </ControlSpecimen>
        <ControlSpecimen
          kind="controls"
          title="Раскрытие без потери контекста"
          description="Accordion раскрывает пояснение на месте, а tabs переключают равноправные состояния одной области."
        >
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
          <TabsRoot
            className={styles.tabsDemo}
            value={feedbackTab}
            onValueChange={setFeedbackTab}
          >
            <TabsList
              label="Пример состояний"
              hidden={!enhanced}
              className={enhanced ? undefined : styles.enhancedOnly}
            >
              <TabsTab value="validation">Валидация</TabsTab>
              <TabsTab value="empty">Пустое состояние</TabsTab>
            </TabsList>
            <TabsPanel value="validation" className={styles.tabsPanel}>
              <Typography.Text>
                Ошибка связана с полем программно; введённое значение не
                пропадает.
              </Typography.Text>
            </TabsPanel>
            <TabsPanel value="empty" className={styles.tabsPanel}>
              <EmptyState
                title="Практика ещё не начата"
                description="Решите первую задачу, и здесь появится прогресс темы."
                action={<Button>Начать практику</Button>}
              />
            </TabsPanel>
          </TabsRoot>
        </ControlSpecimen>
      </section>

      <section
        className={styles.section}
        id="components-feedback"
        aria-labelledby="components-feedback-heading"
      >
        <Typography.Title
          order={3}
          id="components-feedback-heading"
          className={styles.patternHeading}
        >
          Статусы и обратная связь
        </Typography.Title>
        <CatalogContractMap
          contracts={componentContracts.feedback}
          label="Контракты статусов и обратной связи"
        />
        <ControlSpecimen
          kind="feedback"
          title="Короткий статус"
          description="Badge маркирует тип или результат и остаётся вторичным по отношению к содержанию."
        >
          <div className={styles.controlsRow}>
            <Badge tone="accent">Задание 16</Badge>
            <Badge>Разбор</Badge>
            <Badge tone="neutral">1 / 5</Badge>
            <Badge tone="success" icon={<CircleCheck size={12} />}>
              решено
            </Badge>
          </div>
        </ControlSpecimen>
        <ControlSpecimen
          kind="feedback"
          title="Ход процесса"
          description="Определённый прогресс показывает долю, неопределённый — только факт продолжающейся работы."
        >
          <div className={styles.progressGrid}>
            <Progress
              label="Прогресс темы"
              max={5}
              value={3}
              valueText="Решено 3 из 5 задач"
            />
            <Progress label="Проверяем ответ" value={null} />
          </div>
        </ControlSpecimen>
        <ControlSpecimen
          kind="feedback"
          title="Развёрнутая обратная связь"
          description="Нейтральное пояснение и предупреждение различаются смыслом, подписью и только затем функциональным цветом."
        >
          <Callout
            tone="idea"
            title="Базовый случай — это выход, а не формальность"
          >
            <Typography.Text>
              Пока рекурсия не достигнет базового случая, вызовы продолжают
              накапливаться в стеке.
            </Typography.Text>
          </Callout>
          <Callout tone="warning" title="Проверьте условие остановки">
            <Typography.Text>
              Без достижимого базового случая Python завершит программу ошибкой
              RecursionError.
            </Typography.Text>
          </Callout>
        </ControlSpecimen>
      </section>

      <section
        className={styles.section}
        id="components-media"
        aria-labelledby="components-media-heading"
      >
        <Typography.Title
          order={3}
          id="components-media-heading"
          className={styles.patternHeading}
        >
          Код и медиа
        </Typography.Title>
        <CatalogContractMap
          contracts={componentContracts.media}
          label="Контракты кода и медиа"
        />
        <CodeBlock
          code={`def trace_countdown(n):\n    if n == 0:\n        print("Стоп")\n        return\n\n    print("Вызов", n)\n    trace_countdown(n - 1)\n    print("Возврат", n)\n\n\ntrace_countdown(3)`}
          label="Пример: трассировка countdown"
          language="python"
          showLineNumbers
        />
        <CodeBlock
          code={`F(3) = 2 · F(2) + 1\nF(2) = 2 · F(1) + 1\nF(1) = 1`}
          label="Запись: раскрытие формулы"
          language="text"
        />
        <div className={styles.imageDemoRow}>
          <div className={styles.imageDemoBox}>
            <Image
              key={loadingDemoKey}
              src={`/diagrams/bst-subtrees.png?demo=${String(loadingDemoKey)}`}
              alt="Двоичное дерево для демонстрации загрузки"
              width={812}
              height={390}
            />
            <Button
              density="compact"
              hierarchy="quiet"
              type="button"
              onClick={() => setLoadingDemoKey((key) => key + 1)}
            >
              Повторить загрузку
            </Button>
          </div>
          <div className={styles.imageDemoBox}>
            <Image src={brokenImageSource} alt="Схема, которая не загрузится" />
          </div>
          <div className={styles.imageDemoBox}>
            <Image
              src={brokenImageSource}
              fallbackSrc="/diagrams/bst-subtrees.png"
              alt="Схема с рабочим fallbackSrc"
              width={812}
              height={390}
            />
          </div>
        </div>
      </section>

      <section
        className={styles.section}
        id="components-learning"
        aria-labelledby="components-learning-heading"
      >
        <Typography.Title
          order={3}
          id="components-learning-heading"
          className={styles.patternHeading}
        >
          Учебный контент
        </Typography.Title>
        <CatalogContractMap
          contracts={componentContracts.learning}
          label="Контракты учебного контента"
        />
        <div className={styles.learningPrimitiveGrid}>
          <div
            className={styles.learningPrimitive}
            data-component-specimen="LessonIntro"
          >
            <code className={styles.typeTag}>LessonIntro · isolated</code>
            <LessonIntro
              accessTier="free"
              eyebrow="Мини-курс"
              summary="Сначала свяжем рекурсию со знакомым повторением, затем разберём один новый вызов."
              taskCount={2}
              technology="Python"
              title="Рекурсия без скачка в сложность"
            />
          </div>
          <div
            className={styles.learningPrimitive}
            data-component-specimen="LessonSectionHeading"
          >
            <code className={styles.typeTag}>
              LessonSectionHeading · default
            </code>
            <LessonSectionHeading index={2}>
              Один шаг рекурсии
            </LessonSectionHeading>
          </div>
        </div>
        <div
          className={styles.learningTheorySpecimen}
          data-component-specimen="LessonTheory"
        >
          <code className={styles.typeTag}>LessonTheory · one concept</code>
          <LessonTheory
            concepts={[
              {
                id: "catalog-recursive-step",
                navLabel: "Что происходит при новом вызове",
                explanation: (
                  <Typography.Text>
                    Функция получает меньшее значение и решает ту же задачу ещё
                    раз. Такой повтор называется рекурсивным вызовом.
                  </Typography.Text>
                ),
              },
            ]}
          />
        </div>
        <LearningVisualFrame
          accessibleDescription="Три последовательно уменьшающихся значения: 3, 2 и 1; стрелки показывают переход к следующему вызову."
          caption="Один и тот же шаг с меньшим аргументом"
          className={styles.learningFrameSpecimen}
          purpose="Показать направление рекурсивных вызовов"
        >
          <div
            className={styles.recursionSequence}
            data-component-specimen="LearningVisualFrame"
          >
            <code>3</code>
            <span aria-hidden="true">→</span>
            <code>2</code>
            <span aria-hidden="true">→</span>
            <code>1</code>
          </div>
        </LearningVisualFrame>
        <WorkedExample
          title="Сколько раз вызовется countdown(3)?"
          prompt={<code>countdown(n)</code>}
          steps={[
            <span key="one">Вызов с 3 переходит к 2.</span>,
            <span key="two">Вызов с 2 переходит к 1.</span>,
            <span key="three">Вызов с 1 переходит к базовому случаю 0.</span>,
            <span key="four">Итого функция вызывается четыре раза.</span>,
          ]}
        />
        <Procedure
          title="Как спроектировать рекурсивную функцию"
          steps={[
            {
              label: "Определите базовый случай.",
              detail: "Назовите вход, при котором новый вызов не нужен.",
            },
            {
              label: "Определите рекурсивный переход.",
              detail: "Сведите исходную задачу к меньшей задаче того же типа.",
            },
            {
              label: "Докажите приближение к остановке.",
              detail: "Проверьте, что каждый шаг ведёт к базовому случаю.",
            },
          ]}
        />
        <Mistake
          claim={<>Каждый рекурсивный вызов ускоряет программу.</>}
          explanation={
            <>
              Рекурсия помогает выразить структуру задачи, но добавляет вызовы.
            </>
          }
        />
        <Diagram
          src="/diagrams/bst-subtrees.png"
          alt="Двоичное дерево поиска с корнем 10."
          caption="Свойство двоичного дерева поиска"
          purpose="Показать деление дерева на два поддерева"
        />
        <Checkpoint
          items={[
            {
              id: "catalog-base-case",
              prompt: "Что произойдёт без базового случая?",
              reveal: "Вызовы продолжатся до RecursionError.",
            },
          ]}
        />
      </section>

      <section
        className={styles.section}
        id="components-features"
        aria-labelledby="components-features-heading"
      >
        <Typography.Title
          order={3}
          id="components-features-heading"
          className={styles.patternHeading}
        >
          Продуктовые features
        </Typography.Title>
        <CatalogContractMap
          contracts={componentContracts.features}
          label="Публичные feature-контракты"
        />
        <div className={styles.featureSpecimenGrid}>
          <div
            className={styles.featureSpecimen}
            data-component-specimen="LessonProgress"
          >
            <code className={styles.typeTag}>LessonProgress · core states</code>
            <div className={styles.progressStateGrid}>
              {[
                { id: "empty", solved: 0 },
                { id: "in-progress", solved: 2 },
                { id: "mastered", solved: 4 },
                { id: "complete", solved: 5 },
              ].map((state) => (
                <div data-progress-state={state.id} key={state.id}>
                  <LessonProgress
                    headingOrder={4}
                    headingId={`catalog-lesson-progress-${state.id}`}
                    masteryThreshold={0.8}
                    solved={state.solved}
                    total={5}
                  />
                </div>
              ))}
            </div>
          </div>
          <div
            className={styles.featureSpecimen}
            data-component-specimen="LessonPractice"
          >
            <code className={styles.typeTag}>
              LessonPractice · rich content и feedback
            </code>
            <div className={styles.practiceStateGrid}>
              <div data-practice-mode="local">
                <code className={styles.typeTag}>Локальная проверка</code>
                <LessonPractice
                  acceptedAnswers={{}}
                  checkAnswer={createLocalPracticeChecker(
                    componentPracticeTasks,
                  )}
                  onTaskSolved={() => 1}
                  solvedTaskIds={[]}
                  tasks={componentPracticeTasks}
                />
              </div>
              <div data-practice-mode="error">
                <code className={styles.typeTag}>Проверка недоступна</code>
                <LessonPractice
                  acceptedAnswers={{}}
                  checkAnswer={() =>
                    Promise.reject(new Error("Controlled lab error"))
                  }
                  onTaskSolved={() => 0}
                  solvedTaskIds={[]}
                  tasks={componentErrorPracticeTasks}
                />
              </div>
            </div>
          </div>
        </div>
        <Typography.Text className={styles.placeholder}>
          Условие, подсказка и решение используют один строгий renderer: текст,
          списки, Python/text-код, таблицы, локальные изображения и схемы,
          authored-вложения, callout и пошаговый разбор. Произвольные HTML/MDX,
          SVG-вложения, video/iframe и внешние embeds не поддерживаются. Здесь
          <code>LessonPractice</code> не подключён к progress store; его
          production-сборка <code>LessonPracticeFlow</code> остаётся во вкладке
          «Виджеты».
        </Typography.Text>
      </section>
    </CatalogLayout>
  );
};
