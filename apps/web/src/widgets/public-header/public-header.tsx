import { Link } from "@tanstack/react-router";
import { ActionLink } from "~/shared/components/action-link";
import { PublicHeaderIdentity } from "./public-header-identity";
import styles from "./public-header.module.css";

export type PublicHeaderProps = {
  activeSection?: "courses" | "topics";
  home?: boolean;
};

const FutureItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className={styles.futureItem} aria-disabled="true">
    {children}
  </span>
);

const PublicNavigation: React.FC<{
  activeSection?: PublicHeaderProps["activeSection"];
  compact?: boolean;
}> = ({ activeSection, compact = false }) => (
  <div className={compact ? styles.mobileNavigation : styles.desktopNavigation}>
    <nav className={styles.sections} aria-label="Разделы сайта">
      <ActionLink
        className={styles.sectionLink}
        data-current={activeSection === "topics" || undefined}
        hierarchy="drawn"
        to="/ege/"
      >
        Темы
      </ActionLink>
      <ActionLink
        className={styles.sectionLink}
        data-current={activeSection === "courses" || undefined}
        hierarchy="drawn"
        to="/courses/$courseSlug"
        params={{ courseSlug: "python" }}
      >
        Мини-курсы
      </ActionLink>
      <FutureItem>Задания</FutureItem>
      <FutureItem>Статистика</FutureItem>
      <FutureItem>О проекте</FutureItem>
    </nav>
  </div>
);

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  activeSection,
  home = false,
}) => {
  const expanded = home || activeSection !== undefined;

  return (
    <header
      className={styles.root}
      data-public-header
      data-expanded={expanded || undefined}
      data-home={home || undefined}
    >
      <div className={styles.inner}>
        {home ? (
          <span
            className={styles.brand}
            aria-label="infraege — ЕГЭ информатика"
          >
            <PublicHeaderIdentity expanded />
          </span>
        ) : (
          <Link
            aria-label="infraege — ЕГЭ информатика, на главную"
            className={styles.brand}
            to="/"
          >
            <PublicHeaderIdentity expanded={expanded} />
          </Link>
        )}

        {expanded ? (
          <>
            <span className={styles.divider} aria-hidden="true" />
            <PublicNavigation activeSection={activeSection} />
            <details className={styles.mobileMenu}>
              <summary>Меню</summary>
              <PublicNavigation activeSection={activeSection} compact />
            </details>
          </>
        ) : null}
      </div>
    </header>
  );
};
