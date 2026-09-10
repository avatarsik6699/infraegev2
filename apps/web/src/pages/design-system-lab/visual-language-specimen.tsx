import { ActionLink } from "~/shared/components/action-link";
import { Typography } from "~/shared/components/typography";
import { VisualLanguageCard } from "./visual-language-card";
import { VisualLanguageLearning } from "./visual-language-learning";
import { VisualLanguageForm } from "./visual-language-form";
import { VisualLanguageStates } from "./visual-language-states";
import styles from "./visual-language-specimen.module.css";

export const VisualLanguageSpecimen: React.FC = () => (
  <section
    className={styles.section}
    id="system-visual-language"
    aria-labelledby="system-visual-language-heading"
  >
    <Typography.Title order={3} id="system-visual-language-heading">
      Визуальный язык: готовые композиции
    </Typography.Title>
    <Typography.Text>
      Эталоны — мини-курсы и обзор Python. Сетка связывает композицию, бумажный
      материал даёт глубину, иллюстрация объясняет направление, а свет
      подчёркивает форму.
    </Typography.Text>
    <div className={styles.examples}>
      <VisualLanguageCard />
      <VisualLanguageCard planned />
    </div>
    <Typography.Text tone="muted">
      SurfaceMaterial + SvgPattern.Grid/Preset + Image + SurfaceGlint(frame) +
      ActionLink. Иллюстрация может немного выходить за верхнюю границу; текст и
      действие занимают собственное место. У запланированной карточки нет
      ссылки, подъёма и блика рамки.
    </Typography.Text>
    <Typography.Title order={4}>Учебный блок и форма</Typography.Title>
    <Typography.Text>
      В учебном примере объяснение и код собраны вместе отступами и
      выравниванием, без общей подложки. В форме мягкий свет прекращается при
      работе с полем.
    </Typography.Text>
    <div className={styles.examples}>
      <VisualLanguageLearning />
      <VisualLanguageForm />
    </div>
    <Typography.Text tone="muted">
      Этот вариант используется в двух опубликованных уроках ЕГЭ. Полный образец
      показывает вступление, содержание, практику и итог на одной странице.
    </Typography.Text>
    <ActionLink to="/lab/lesson" hierarchy="drawn" icon="forward">
      Открыть образец урока
    </ActionLink>
    <VisualLanguageStates />
  </section>
);
