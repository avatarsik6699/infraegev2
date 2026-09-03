import { Typography } from "~/shared/components/typography";
import { spacingTokens } from "./design-system-lab.constants";
import styles from "./design-system-lab.module.css";
import {
  SemanticTokenPreview,
  type SemanticToken,
} from "./semantic-token-preview";

const tokenGroups = [
  {
    title: "Цвет и обратная связь",
    tokens: [
      {
        name: "--color-bg",
        purpose: "Фон страницы",
        label: "Фон",
        kind: "background",
      },
      {
        name: "--color-surface",
        purpose: "Основная поверхность",
        label: "Поверхность",
        kind: "background",
      },
      {
        name: "--color-surface-quiet",
        purpose: "Тихая поверхность",
        label: "Тихая поверхность",
        kind: "background",
      },
      {
        name: "--color-text",
        purpose: "Основной текст",
        label: "Основной текст",
        kind: "text",
      },
      {
        name: "--color-text-soft",
        purpose: "Вторичный текст",
        label: "Вторичный текст",
        kind: "text",
      },
      {
        name: "--color-rule",
        purpose: "Структурная линия",
        label: "Линия",
        kind: "rule",
      },
      {
        name: "--color-rule-strong",
        purpose: "Усиленная граница",
        label: "Граница",
        kind: "rule",
      },
      {
        name: "--color-focus",
        purpose: "Цвет клавиатурного фокуса",
        label: "Фокус",
        kind: "focus-color",
      },
      {
        name: "--color-success",
        purpose: "Успешное состояние",
        label: "Успех",
        kind: "text",
      },
      {
        name: "--color-info",
        purpose: "Учебная самопроверка",
        label: "Информация",
        kind: "text",
      },
      {
        name: "--color-warning",
        purpose: "Предупреждение",
        label: "Предупреждение",
        kind: "text",
      },
      {
        name: "--color-danger",
        purpose: "Ошибка",
        label: "Ошибка",
        kind: "text",
      },
      {
        name: "--color-code",
        purpose: "Поверхность кода",
        label: "Код",
        kind: "background",
        previewTextColor: "--color-code-text",
      },
    ],
  },
  {
    title: "Типографика и меры",
    tokens: [
      {
        name: "--text-xs",
        purpose: "Компактная подпись",
        label: "Aa",
        kind: "font-size",
      },
      {
        name: "--text-base",
        purpose: "Основной набор",
        label: "Aa",
        kind: "font-size",
      },
      {
        name: "--text-lg",
        purpose: "Ведущий текст",
        label: "Aa",
        kind: "font-size",
      },
      {
        name: "--text-xl",
        purpose: "Локальный заголовок",
        label: "Aa",
        kind: "font-size",
      },
      {
        name: "--measure-reading",
        purpose: "Читаемая строка",
        label: "reading · 68ch",
        kind: "measure",
      },
      {
        name: "--measure-wide",
        purpose: "Широкий материал",
        label: "wide · 76rem",
        kind: "measure",
      },
      {
        name: "--max-content-width",
        purpose: "Предел страницы",
        label: "page · 76rem",
        kind: "measure",
      },
    ],
  },
  {
    title: "Геометрия и слои",
    tokens: [
      {
        name: "--radius-control",
        purpose: "Геометрия контрола",
        label: "Контрол",
        kind: "radius",
      },
      {
        name: "--radius-surface",
        purpose: "Геометрия поверхности",
        label: "Поверхность",
        kind: "radius",
      },
      {
        name: "--radius-pill",
        purpose: "Капсула и индикатор",
        label: "Капсула",
        kind: "radius",
      },
      {
        name: "--shadow-overlay",
        purpose: "Временный overlay",
        label: "Overlay",
        kind: "shadow",
      },
    ],
  },
  {
    title: "Фокус и движение",
    tokens: [
      {
        name: "--focus-ring",
        purpose: "Дополнительное кольцо фокуса",
        label: "Focus ring",
        kind: "focus-shadow",
      },
      {
        name: "--motion-duration",
        purpose: "Базовая длительность",
        label: "Длительность",
        kind: "motion-duration",
      },
      {
        name: "--motion-easing",
        purpose: "Базовая кривая",
        label: "Кривая",
        kind: "motion-easing",
      },
    ],
  },
] as const satisfies readonly {
  title: string;
  tokens: readonly SemanticToken[];
}[];

export const SystemTokenSpecimen: React.FC = () => (
  <section
    className={styles.section}
    id="system-tokens"
    aria-labelledby="system-tokens-heading"
  >
    <Typography.Title
      order={3}
      id="system-tokens-heading"
      className={styles.patternHeading}
    >
      Карта CSS-переменных
    </Typography.Title>
    <Typography.Text className={styles.paletteDescription}>
      Каталог показывает не все внутренние значения, а поддерживаемый путь от
      профиля темы к семантической роли и затем к CSS конкретного компонента.
    </Typography.Text>
    <ol className={styles.tokenArchitecture} aria-label="Архитектура токенов">
      <li>
        <code>--theme-*</code>
        <strong>Профиль</strong>
        <span>Хранит заменяемые значения палитры, шрифтов и геометрии.</span>
      </li>
      <li>
        <code>--color-* · --text-* · --space-*</code>
        <strong>Семантика</strong>
        <span>Называет назначение и является границей для потребителей.</span>
      </li>
      <li>
        <code>component.module.css</code>
        <strong>Применение</strong>
        <span>Компонент выбирает роль, не зная текущего профиля.</span>
      </li>
    </ol>
    <div className={styles.tokenGroupGrid}>
      {tokenGroups.map((group) => (
        <div key={group.title} className={styles.tokenGroup}>
          <Typography.Title order={4} className={styles.subheading}>
            {group.title}
          </Typography.Title>
          <dl className={styles.semanticTokenList}>
            {group.tokens.map((token) => (
              <div
                key={token.name}
                className={styles.semanticTokenRow}
                data-semantic-token={token.name}
              >
                <dt>
                  <code>{token.name}</code>
                  <span>{token.purpose}</span>
                </dt>
                <dd>
                  <SemanticTokenPreview token={token} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
    <div className={styles.spacingTokenGroup}>
      <Typography.Title order={4} className={styles.subheading}>
        Шкала расстояний
      </Typography.Title>
      <ul className={styles.spacingList}>
        {spacingTokens.map((token) => (
          <li key={token.name} className={styles.spacingItem}>
            <code className={styles.colorVar}>{token.name}</code>
            <span
              className={styles.spacingBar}
              style={{ width: `var(${token.name})` }}
              data-spacing-token-preview={token.name}
              aria-hidden="true"
            />
          </li>
        ))}
      </ul>
    </div>
    <Typography.Text className={styles.tokenBoundaryNote}>
      Component defaults живут в общей token-границе, а syntax colors и lab-only
      размеры остаются у своих владельцев. Здесь показаны только роли, которыми
      пользуется всё приложение.
    </Typography.Text>
  </section>
);
