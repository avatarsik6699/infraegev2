import type { CatalogContract } from "./catalog-contract-map";

const catalogContracts = {
  live: (name: string, note: string): CatalogContract => ({
    name,
    note,
    status: "live",
  }),
  context: (name: string, note: string): CatalogContract => ({
    name,
    note,
    status: "context",
  }),
};

export const componentContracts = {
  content: [
    catalogContracts.live("Typography", "Текстовые роли и ограничение строк"),
    catalogContracts.live("PageContainer", "Три смысловые ширины контента"),
    catalogContracts.live("Notation", "Кодовая и формульная запись"),
  ],
  actions: [
    catalogContracts.live("Button", "Иерархия, плотность, loading и disabled"),
    catalogContracts.live(
      "ActionLink",
      "Кнопочное или текстовое навигационное действие",
    ),
    catalogContracts.live("BackLink", "Возврат с безопасным fallback"),
    catalogContracts.live("ExternalLink", "Внешний переход с явным поведением"),
    catalogContracts.live("FragmentLink", "Переход к разделу текущей страницы"),
    catalogContracts.live(
      "ConfirmationDialog",
      "Подтверждение необратимого действия",
    ),
    catalogContracts.live(
      "DownloadLink",
      "Скачивание локального authored-файла",
    ),
  ],
  input: [
    catalogContracts.live("Input", "Самостоятельное поле ввода"),
    catalogContracts.context(
      "SelectField",
      "Практика в visual-language specimen: native GET-select без JavaScript",
    ),
    catalogContracts.live("Field", "Подпись, описание, ошибка и disabled"),
    catalogContracts.live("Accordion", "Раскрытие пояснений на месте"),
    catalogContracts.context(
      "ResponsiveDisclosure",
      "Образец /lab/lesson: мобильное содержание сворачивается, desktop и SSR сохраняют полный список",
    ),
    catalogContracts.live("TabsRoot", "Владелец выбранного состояния"),
    catalogContracts.live("TabsList", "Семантический список вкладок"),
    catalogContracts.live("TabsTab", "Доступный интерактивный переключатель"),
    catalogContracts.live("TabsPanel", "Связанная область содержимого"),
  ],
  feedback: [
    catalogContracts.live(
      "StatusScene",
      "Система → Вспомогательные состояния: иллюстрация, сообщение и действие",
    ),
    catalogContracts.live("Badge", "Нейтральные и функциональные статусы"),
    catalogContracts.live("Progress", "Определённый и неопределённый процесс"),
    catalogContracts.live("Callout", "Пояснение и предупреждение"),
    catalogContracts.live(
      "EmptyState",
      "Пустое состояние со следующим действием",
    ),
  ],
  media: [
    catalogContracts.context(
      "SurfaceMaterial",
      "Система → Визуальный язык: бумажный слой карточки",
    ),
    catalogContracts.context(
      "SurfaceGlint",
      "Система → Визуальный язык: frame, sweep и soft; однократный/циклический свет",
    ),
    catalogContracts.live("CodeBlock", "Код и текстовая запись"),
    catalogContracts.live("Image", "Загрузка, ошибка и fallback"),
    catalogContracts.context(
      "CustomIcon",
      "DecorativePrimitives: SVG-контекст и нормализованные глифы",
    ),
    catalogContracts.context(
      "DrawnLinkUnderline",
      "ActionLink и ExternalLink: drawn-подчёркивание",
    ),
    catalogContracts.context(
      "SvgDrawing",
      "DecorativePrimitives: линия и стрелка",
    ),
    catalogContracts.context(
      "SvgPattern",
      "DecorativePrimitives: поле с направляющей",
    ),
  ],
  learning: [
    catalogContracts.live(
      "Checkpoint",
      "Проверка понимания с раскрываемым ответом",
    ),
    catalogContracts.live("Diagram", "Изображение с учебной подписью"),
    catalogContracts.live(
      "LearningVisualFrame",
      "Рамка визуала с текстовой альтернативой",
    ),
    catalogContracts.live("LessonIntro", "Заголовок и метаданные урока"),
    catalogContracts.live(
      "LessonSectionHeading",
      "Нумерованный заголовок учебного раздела",
    ),
    catalogContracts.live("LessonTheory", "Линейный поток понятий"),
    catalogContracts.live(
      "Mistake",
      "Сравнение ошибочного и правильного рассуждения",
    ),
    catalogContracts.live("Procedure", "Последовательность действий"),
    catalogContracts.live("WorkedExample", "Пошаговый разбор"),
  ],
  features: [
    catalogContracts.context(
      "PracticeProgressProvider",
      "Provider приложения: отдельная история задач по revision, без прогресса уроков",
    ),
    catalogContracts.live(
      "StandalonePractice",
      "Самостоятельная задача и повторная попытка во вкладке Виджеты",
    ),
    catalogContracts.live(
      "AnalyticsConsentNotice",
      "Изолированный пример выбора аналитики",
    ),
    catalogContracts.context(
      "AnalyticsConsentPrompt",
      "Этот notice в глобальном баннере при первом посещении",
    ),
    catalogContracts.context(
      "AnalyticsConsentControl",
      "Настройки на странице privacy; реальное согласие не меняется в lab",
    ),
    catalogContracts.context(
      "LessonProgressProvider",
      "Общий provider приложения; lab использует отдельные lesson ids",
    ),
    catalogContracts.live(
      "LessonPractice",
      "Локальная проверка без progress store и сети",
    ),
    catalogContracts.live(
      "LessonProgress",
      "Чистое представление переданного прогресса",
    ),
    catalogContracts.context(
      "ReadingPositionIndicator",
      "Наблюдает за scroll-target страницы урока",
    ),
  ],
} as const;

export const widgetContracts = {
  chrome: [
    catalogContracts.live(
      "PublicHeader",
      "Действующая infraege-айдентика публичных страниц",
    ),
    catalogContracts.live("PublicFooter", "Действующая навигация в подвале"),
  ],
  learning: [
    catalogContracts.live(
      "LessonOutline",
      "Содержание урока и активная смысловая ветка",
    ),
  ],
  flow: [
    catalogContracts.live(
      "LessonPracticeFlow",
      "Практика, связанная с локальным прогрессом",
    ),
  ],
} as const;
