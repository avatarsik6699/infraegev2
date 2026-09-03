import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleCheck,
  CircleHelp,
  Copy,
  Download,
  FileText,
  ImageOff,
  Lightbulb,
  Link,
  TriangleAlert,
} from "lucide-react";
import { Typography } from "~/shared/components/typography";
import { CatalogLayout } from "./catalog-layout";
import {
  colorTokens,
  fontTokens,
  systemSections,
  tonalSteps,
} from "./design-system-lab.constants";
import styles from "./design-system-lab.module.css";
import { RhythmSpecimen } from "./rhythm-specimen";
import { SurfaceSpecimen } from "./surface-specimen";
import { SystemAccessibilitySpecimen } from "./system-accessibility-specimen";
import { SystemContentLanguageSpecimen } from "./system-content-language-specimen";
import { SystemLayoutSpecimen } from "./system-layout-specimen";
import { SystemTokenSpecimen } from "./system-token-specimen";

const iconContracts = [
  { name: "ArrowLeft", Icon: ArrowLeft },
  { name: "ArrowRight", Icon: ArrowRight },
  { name: "ArrowUpRight", Icon: ArrowUpRight },
  { name: "Check", Icon: Check },
  { name: "ChevronDown", Icon: ChevronDown },
  { name: "CircleCheck", Icon: CircleCheck },
  { name: "CircleHelp", Icon: CircleHelp },
  { name: "Copy", Icon: Copy },
  { name: "Download", Icon: Download },
  { name: "FileText", Icon: FileText },
  { name: "ImageOff", Icon: ImageOff },
  { name: "Lightbulb", Icon: Lightbulb },
  { name: "Link", Icon: Link },
  { name: "TriangleAlert", Icon: TriangleAlert },
] as const;

export const SystemCatalog: React.FC = () => (
  <CatalogLayout
    title="Система"
    description="Общие решения, которые задают язык всего приложения до появления конкретного компонента: айдентика, типографика, цвет, layout, доступность, токены, иконки и язык контента."
    sections={systemSections}
  >
    <section
      className={styles.section}
      id="system-identity"
      aria-labelledby="system-identity-heading"
    >
      <Typography.Title
        order={3}
        id="system-identity-heading"
        className={styles.patternHeading}
      >
        Айдентика
      </Typography.Title>
      <div className={styles.identitySpecimen}>
        <span className={styles.identityWordmark}>ALCHIMIA</span>
        <div>
          <Typography.Text>
            Живой wordmark остаётся доступным текстом, а знак — декоративным
            изображением из единственного утверждённого SVG-источника.
          </Typography.Text>
          <code className={styles.colorVar}>logo.svg · source of truth</code>
        </div>
      </div>
    </section>

    <section
      className={styles.section}
      id="system-typography"
      aria-labelledby="system-typography-heading"
    >
      <Typography.Title
        order={3}
        id="system-typography-heading"
        className={styles.patternHeading}
      >
        Шрифты и роли
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
      <Typography.Text tone="muted">
        Уровень h1–h6 задаёт структуру документа. Все стандартные заголовки
        используют Cormorant SC; Literata остаётся гарнитурой непрерывного
        чтения, а IBM Plex Mono — служебного текста, данных и кода.
      </Typography.Text>
      <div className={styles.typeSamples}>
        {([1, 2, 3, 4, 5, 6] as const).map((order) => (
          <div className={styles.typeRow} key={order}>
            <code className={styles.typeTag}>heading · h{order}</code>
            <Typography.Title order={order}>
              Базовый случай и шаг рекурсии
            </Typography.Title>
          </div>
        ))}
        {(["lead", "body", "interface", "caption"] as const).map((role) => (
          <div className={styles.typeRow} key={role}>
            <code className={styles.typeTag}>text · {role}</code>
            <Typography.Text variant={role}>
              Каждый вызов приближает вычисление к базовому случаю.
            </Typography.Text>
          </div>
        ))}
      </div>
    </section>

    <section
      className={styles.section}
      id="system-color"
      aria-labelledby="system-color-heading"
    >
      <Typography.Title
        order={3}
        id="system-color-heading"
        className={styles.patternHeading}
      >
        Цвет
      </Typography.Title>
      <Typography.Text className={styles.paletteDescription}>
        Белый фон, два нейтральных уровня текста и ахроматические линии ведут
        композицию. Статусные цвета сохраняют только функциональный смысл.
      </Typography.Text>
      <div className={styles.paletteGroups} data-palette-groups>
        <div className={styles.paletteGroup} data-palette-group="core">
          <Typography.Title order={4} className={styles.paletteGroupTitle}>
            Основные роли
          </Typography.Title>
          <ul className={styles.colorGrid} data-alchimia-palette>
            {colorTokens.map((token) => (
              <li
                key={token.name}
                className={styles.colorItem}
                data-color-role={token.name}
              >
                <span
                  className={styles.swatch}
                  style={{ background: `var(${token.name})` }}
                  aria-hidden="true"
                />
                <span className={styles.colorLabel}>{token.label}</span>
                <span className={styles.colorUsage}>{token.usage}</span>
                <code className={styles.colorVar}>{token.name}</code>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.paletteGroup} data-palette-group="tonal">
          <Typography.Title order={4} className={styles.paletteGroupTitle}>
            Поверхности
          </Typography.Title>
          <ul className={styles.tonalGrid}>
            {tonalSteps.map((token) => (
              <li key={token.name} className={styles.tonalItem}>
                <span
                  className={styles.tonalSwatch}
                  style={{ background: `var(${token.name})` }}
                  aria-hidden="true"
                />
                <code className={styles.colorVar}>{token.label}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    <SurfaceSpecimen />
    <SystemLayoutSpecimen />
    <SystemAccessibilitySpecimen />
    <SystemTokenSpecimen />
    <RhythmSpecimen />

    <section
      className={styles.section}
      id="system-icons"
      aria-labelledby="system-icons-heading"
    >
      <Typography.Title
        order={3}
        id="system-icons-heading"
        className={styles.patternHeading}
      >
        Иконки
      </Typography.Title>
      <ul className={styles.iconGrid} aria-label="Используемые иконки Lucide">
        {iconContracts.map(({ Icon, name }) => (
          <li key={name} className={styles.iconItem} data-icon-specimen={name}>
            <Icon size={24} aria-hidden="true" focusable="false" />
            <code>{name}</code>
          </li>
        ))}
      </ul>
    </section>

    <SystemContentLanguageSpecimen />
  </CatalogLayout>
);
