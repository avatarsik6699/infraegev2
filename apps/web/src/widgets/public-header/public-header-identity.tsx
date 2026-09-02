import alchimiaMarkUrl from "./assets/alchimia-mark.svg";
import styles from "./public-header.module.css";

export const PublicHeaderIdentity: React.FC = () => (
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
