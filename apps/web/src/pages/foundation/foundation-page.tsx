import { ActionLink } from "~/shared/components/action-link";
import { Typography } from "~/shared/components/typography";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { HomeLearningMap } from "./home-learning-map";
import styles from "./foundation-page.module.css";

export const FoundationPage: React.FC = () => (
  <div className={styles.page}>
    <PublicHeader home />
    <main className={styles.hero} data-foundation-layout>
      <section className={styles.intro}>
        <Typography.Title className={styles.heroTitle} order={1}>
          <span>Информатика -</span>
          <span>это система</span>
        </Typography.Title>
        <Typography.Text className={styles.lead} variant="lead">
          Подготовка к ЕГЭ без зубрёжки
        </Typography.Text>
        <ActionLink
          className={styles.primaryAction}
          hierarchy="drawn"
          icon="forward"
          to="/courses/$courseSlug"
          params={{ courseSlug: "python" }}
        >
          Начать подготовку
        </ActionLink>
      </section>

      <section
        className={styles.visual}
        aria-label="Учебный путь: теория, практика, задания и будущая статистика"
      >
        <Typography.Text className={styles.visuallyHidden}>
          Сначала разберите теорию, затем закрепите её на практике и переходите
          к заданиям. Персональная статистика появится позже.
        </Typography.Text>
        <HomeLearningMap />
      </section>
    </main>
    <PublicFooter />
  </div>
);
