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
        <span className={styles.brand}>{siteConfig.name}</span>
      ) : (
        <Link
          aria-label="infraege — на главную"
          className={styles.brand}
          to="/"
        >
          {siteConfig.name}
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
