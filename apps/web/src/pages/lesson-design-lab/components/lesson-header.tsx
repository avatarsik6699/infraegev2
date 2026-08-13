import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Typography } from "~/shared/components/typography";
import styles from "../lesson-design-lab.module.css";

export const LessonHeader: React.FC = () => (
  <>
    <header className={styles.siteHeader} data-lesson-site-header>
      <Link aria-label="infraege — на главную" className={styles.brand} to="/">
        <span className={styles.brandName}>infra</span>
        <span className={styles.brandSignal}>ege</span>
      </Link>
    </header>
    <div className={styles.subheader} data-lesson-subheader>
      <Link className={styles.backLink} to="/">
        <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.7} />
        <span>Назад к темам</span>
      </Link>
      <Typography.Text className={styles.lessonContext}>
        <span>№12</span>
        <span aria-hidden="true">·</span>
        <span>Алгоритмы поиска</span>
      </Typography.Text>
    </div>
  </>
);
