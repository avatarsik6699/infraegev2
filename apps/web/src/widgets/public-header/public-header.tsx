import { Link } from "@tanstack/react-router";
import { siteConfig } from "~/shared/config/site";
import styles from "./public-header.module.css";

type PublicHeaderProps = {
  home?: boolean;
};

export const PublicHeader: React.FC<PublicHeaderProps> = ({ home = false }) => (
  <header className={styles.root}>
    <div className={styles.identity}>
      {home ? (
        <span className={styles.brand}>
          <span className={styles.mark} data-brand-mark aria-hidden="true" />
          <span className={styles.wordmark}>
            <span>infra</span>
            <span className={styles.signal}>ege</span>
          </span>
        </span>
      ) : (
        <Link
          aria-label="infraege — на главную"
          className={styles.brand}
          to="/"
        >
          <span className={styles.mark} data-brand-mark aria-hidden="true" />
          <span className={styles.wordmark}>
            <span>infra</span>
            <span className={styles.signal}>ege</span>
          </span>
        </Link>
      )}
      <span className={styles.releaseLabel}>{siteConfig.releaseLabel}</span>
    </div>
    <span
      className={styles.version}
      aria-label={`Версия ${siteConfig.version}`}
    >
      {`v${siteConfig.version}`}
    </span>
  </header>
);
