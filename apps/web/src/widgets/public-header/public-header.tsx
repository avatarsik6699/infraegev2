import { Link } from "@tanstack/react-router";
import { PublicHeaderIdentity } from "./public-header-identity";
import styles from "./public-header.module.css";

export type PublicHeaderProps = {
  home?: boolean;
};

const FutureItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className={styles.futureItem} aria-disabled="true">
    {children}
  </span>
);

const HomeNavigation: React.FC<{ compact?: boolean }> = ({
  compact = false,
}) => (
  <div className={compact ? styles.mobileNavigation : styles.desktopNavigation}>
    <nav className={styles.sections} aria-label="Разделы сайта">
      <FutureItem>Темы</FutureItem>
      <Link to="/courses/$courseSlug" params={{ courseSlug: "python" }}>
        Мини-курсы
      </Link>
      <FutureItem>Задания</FutureItem>
      <FutureItem>Статистика</FutureItem>
      <FutureItem>О проекте</FutureItem>
    </nav>
  </div>
);

export const PublicHeader: React.FC<PublicHeaderProps> = ({ home = false }) => (
  <header
    className={styles.root}
    data-public-header
    data-home={home || undefined}
  >
    <div className={styles.inner}>
      {home ? (
        <span className={styles.brand} aria-label="infraege — ЕГЭ информатика">
          <PublicHeaderIdentity expanded />
        </span>
      ) : (
        <Link
          aria-label="infraege — ЕГЭ информатика, на главную"
          className={styles.brand}
          to="/"
        >
          <PublicHeaderIdentity />
        </Link>
      )}

      {home ? (
        <>
          <span className={styles.divider} aria-hidden="true" />
          <HomeNavigation />
          <details className={styles.mobileMenu}>
            <summary>Меню</summary>
            <HomeNavigation compact />
          </details>
        </>
      ) : null}
    </div>
  </header>
);
