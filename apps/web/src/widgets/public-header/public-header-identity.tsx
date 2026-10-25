import styles from "./public-header.module.css";

export const PublicHeaderIdentity: React.FC = () => (
  <>
    <span className={styles.mark} data-kodumka-mark aria-hidden="true" />
    <span className={styles.name} data-kodumka-name>
      <span className={styles.wordmark} data-kodumka-wordmark>
        Кодумка
      </span>
      <span className={styles.subtitle} data-kodumka-subtitle>
        подготовка к ЕГЭ по информатике
      </span>
    </span>
  </>
);
