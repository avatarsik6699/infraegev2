import styles from "./public-header.module.css";

export const PublicHeaderIdentity: React.FC<{ expanded?: boolean }> = ({
  expanded = false,
}) => (
  <>
    <span className={styles.mark} data-infraege-mark aria-hidden="true" />
    <span className={styles.name} data-infraege-name>
      <span className={styles.wordmark} data-infraege-wordmark>
        infraege
      </span>
      <span className={styles.subtitle} data-infraege-subtitle>
        подготовка к ЕГЭ по информатике
      </span>
      {expanded ? (
        <span className={styles.benefits} data-infraege-benefits>
          <span>просто</span>
          <i aria-hidden="true" />
          <span>понятно</span>
          <i aria-hidden="true" />
          <span>бесплатно</span>
        </span>
      ) : null}
    </span>
  </>
);
