import { Link } from "@tanstack/react-router";
import alchimiaMarkUrl from "./assets/alchimia-mark.svg";
import styles from "./alchimia-header.module.css";

export type AlchimiaHeaderProps = {
  home?: boolean;
};

const AlchimiaIdentity: React.FC = () => (
  <>
    <span
      className={styles.mark}
      style={{ backgroundImage: `url("${alchimiaMarkUrl}")` }}
      data-alchimia-mark
      aria-hidden="true"
    />
    <span className={styles.name} data-alchimia-name>
      <span className={styles.wordmark} data-alchimia-wordmark>
        ALCHIMIA
      </span>
      <span className={styles.subtitle} data-alchimia-subtitle>
        ЕГЭ информатика
      </span>
    </span>
  </>
);

export const AlchimiaHeader: React.FC<AlchimiaHeaderProps> = ({
  home = false,
}) => (
  <header className={styles.root} data-alchimia-header>
    <div className={styles.inner}>
      {home ? (
        <span className={styles.brand} aria-label="ALCHIMIA — ЕГЭ информатика">
          <AlchimiaIdentity />
        </span>
      ) : (
        <Link
          className={styles.brand}
          to="/"
          aria-label="ALCHIMIA — ЕГЭ информатика, на главную"
        >
          <AlchimiaIdentity />
        </Link>
      )}
    </div>
  </header>
);
