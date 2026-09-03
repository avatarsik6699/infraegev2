import { Link } from "@tanstack/react-router";
import { PublicHeaderIdentity } from "./public-header-identity";
import styles from "./public-header.module.css";

export type PublicHeaderProps = {
  home?: boolean;
};

export const PublicHeader: React.FC<PublicHeaderProps> = ({ home = false }) => (
  <header className={styles.root} data-public-header data-alchimia-header>
    <div className={styles.inner}>
      {home ? (
        <span className={styles.brand} aria-label="ALCHIMIA — ЕГЭ информатика">
          <PublicHeaderIdentity />
        </span>
      ) : (
        <Link
          aria-label="ALCHIMIA — ЕГЭ информатика, на главную"
          className={styles.brand}
          to="/"
        >
          <PublicHeaderIdentity />
        </Link>
      )}
    </div>
  </header>
);
