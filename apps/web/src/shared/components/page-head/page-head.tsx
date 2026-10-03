import { cssUtils } from "~/shared/lib/css-utils";
import type { PageHeadTypes } from "./page-head.types";
import styles from "./page-head.module.css";

export const PageHead: React.FC<PageHeadTypes.Props> = (props) => (
  <div className={cssUtils.cx(styles.root, props.className)} data-page-head>
    <div className={styles.inner}>
      <div className={styles.copy}>{props.children}</div>
      {props.aside ? <div className={styles.aside}>{props.aside}</div> : null}
    </div>
  </div>
);
