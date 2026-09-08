import { useRef } from "react";
import { ActionLink } from "~/shared/components/action-link";
import { Typography } from "~/shared/components/typography";
import { useElementActivity } from "~/shared/lib/element-activity";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { HomeAmbientField } from "./home-ambient-field";
import { HomeLearningMap } from "./home-learning-map";
import styles from "./foundation-page.module.css";

export const FoundationPage: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const motionActive = useElementActivity(heroRef);

  return (
    <div className={styles.page} data-motion-active={motionActive || undefined}>
      <HomeAmbientField />
      <PublicHeader home />
      <main
        ref={heroRef}
        className={styles.hero}
        data-foundation-layout
        data-motion-active={motionActive || undefined}
      >
        <section className={styles.intro} data-foundation-intro>
          <Typography.Title className={styles.heroTitle} order={1}>
            <span>Информатика -</span>
            <span className={styles.heroSecondLine}>это система</span>
          </Typography.Title>
          <Typography.Text className={styles.introDescription}>
            Готовьтесь к ЕГЭ через понимание: от первой строки кода до
            самостоятельного решения задач.
          </Typography.Text>
          <ActionLink
            className={styles.primaryAction}
            hierarchy="drawn"
            icon="forward"
            to="/ege"
          >
            Начать готовиться
          </ActionLink>
        </section>

        <section
          className={styles.visual}
          aria-label="Учебный путь: теория, практика, задания и будущая статистика"
          data-foundation-visual
        >
          <Typography.Text className={styles.visuallyHidden}>
            Сначала разберите теорию, затем закрепите её на практике и
            переходите к заданиям. Персональная статистика появится позже.
          </Typography.Text>
          <HomeLearningMap />
        </section>
      </main>
      <PublicFooter />
    </div>
  );
};
