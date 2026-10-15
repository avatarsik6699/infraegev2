import { cssUtils } from "~/shared/lib/css-utils";
import { Typography } from "~/shared/components/typography";
import type { PageHeadTypes } from "./page-head.types";
import styles from "./page-head.module.css";

export const PageHead: React.FC<PageHeadTypes.Props> = (props) => (
  <div
    className={cssUtils.cx(styles.root, props.className)}
    data-page-head
    data-backdrop={props.backdrop ? true : undefined}
    data-aside-after-heading={
      props.asideOnNarrow === "after-heading" || undefined
    }
  >
    {props.backdrop}
    <div className={styles.inner}>
      <div className={styles.copy}>
        {props.title === undefined ? (
          props.children
        ) : (
          <>
            <header className={styles.heading}>
              {props.eyebrow ? (
                <div className={styles.eyebrow}>{props.eyebrow}</div>
              ) : null}
              <Typography.Title
                order={1}
                id={props.titleId}
                className={styles.title}
              >
                {props.title}
              </Typography.Title>
              {props.lead ? (
                <Typography.Text variant="lead" className={styles.lead}>
                  {props.lead}
                </Typography.Text>
              ) : null}
              {props.meta ? (
                <div className={styles.meta} data-page-head-meta>
                  {props.meta}
                </div>
              ) : null}
            </header>
            {props.children}
          </>
        )}
      </div>
      {props.aside ? (
        <div
          className={styles.aside}
          data-on-narrow={props.asideOnNarrow || undefined}
        >
          {props.aside}
        </div>
      ) : null}
    </div>
  </div>
);
