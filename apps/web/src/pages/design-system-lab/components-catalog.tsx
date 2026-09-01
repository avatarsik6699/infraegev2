import { CircleCheck } from "lucide-react";
import { useState } from "react";
import { Accordion } from "~/shared/components/accordion";
import { ActionLink } from "~/shared/components/action-link";
import { BackLink } from "~/shared/components/back-link";
import { Badge } from "~/shared/components/badge";
import { Button } from "~/shared/components/button";
import { Callout } from "~/shared/components/callout";
import { CodeBlock } from "~/shared/components/code-block";
import { Divider } from "~/shared/components/divider";
import { EmptyState } from "~/shared/components/empty-state";
import { ExternalLink } from "~/shared/components/external-link";
import { Field } from "~/shared/components/field";
import { FragmentLink } from "~/shared/components/fragment-link";
import { Image } from "~/shared/components/image";
import { Input } from "~/shared/components/input";
import {
  Checkpoint,
  Diagram,
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
import { ControlSpecimen } from "./control-specimen";
import { componentSections } from "./design-system-lab.constants";
import styles from "./design-system-lab.module.css";

const brokenImageSource = "data:image/png;base64,aW52YWxpZA==";
const longHeading =
  "Как найти количество путей из точки A в точку B, если движение разрешено только вправо и вниз";
const longParagraph =
  "Если условие остановки никогда не выполняется, вызовы продолжают накапливаться в стеке вызовов — каждый новый вызов ждёт результата следующего.";

const componentContracts = {
  content: ["Typography", "PageContainer", "Divider", "Notation"],
  actions: ["Button", "ActionLink", "BackLink", "ExternalLink", "FragmentLink"],
  input: ["Input", "Field", "Accordion", "Tabs"],
  feedback: ["Badge", "Progress", "Callout", "EmptyState"],
  media: ["CodeBlock", "Image"],
  learning: [
    "Checkpoint",
    "Diagram",
    "LearningVisualFrame",
    "LessonIntro",
    "LessonSectionHeading",
    "LessonTheory",
    "Mistake",
    "Procedure",
    "WorkedExample",
  ],
  features: [
    "AnalyticsConsentControl",
    "AnalyticsConsentPrompt",
    "LessonPractice",
    "LessonProgress",
    "ReadingPositionIndicator",
  ],
} as const;

const ContractNames: React.FC<{ names: readonly string[] }> = ({ names }) => (
  <ul className={styles.nameGrid} aria-label="Публичные UI-контракты">
    {names.map((name) => (
      <li key={name}>
        <code>{name}</code>
      </li>
    ))}
  </ul>
);

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
        <ContractNames names={componentContracts.content} />
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
        <div className={styles.dividerSamples}>
          <Divider />
          <Divider purpose="comparison" />
          <Divider dashed />
        </div>
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
        <ContractNames names={componentContracts.actions} />
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
            <BackLink fallbackTo="/">Вернуться</BackLink>
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
        <ContractNames names={componentContracts.input} />
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
        <ContractNames names={componentContracts.feedback} />
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
        <ContractNames names={componentContracts.media} />
        <CodeBlock
          code={`def countdown(n):\n    if n == 0:\n        return\n    print(n)\n    countdown(n - 1)`}
          label="Пример: countdown"
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
        <ContractNames names={componentContracts.learning} />
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
        <ContractNames names={componentContracts.features} />
        <Typography.Text className={styles.placeholder}>
          Здесь учитываются только публичные feature-контракты. Приватные части
          практики проверяются через <code>LessonPractice</code>, а её сборка с
          progress store — через <code>LessonPracticeFlow</code> во вкладке
          «Виджеты».
        </Typography.Text>
        <div className={styles.contextNotice}>
          <Typography.Text>
            <strong>Context-bound:</strong> analytics consent и reading position
            не запускаются как самостоятельные live-демо: первое изменяет
            реальное согласие браузера, второе требует владельца scroll-target.
          </Typography.Text>
        </div>
      </section>
    </CatalogLayout>
  );
};
