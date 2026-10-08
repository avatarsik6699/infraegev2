import { ActionLink } from "~/shared/components/action-link";
import { cssUtils } from "~/shared/lib/css-utils";
import type { BreadcrumbsTypes } from "./breadcrumbs.types";
import styles from "./breadcrumbs.module.css";

/**
 * F36: the path to the page — ancestors are links, the current page is
 * plain text with `aria-current="page"`.
 */
export const Breadcrumbs: React.FC<BreadcrumbsTypes.Props> = (props) => (
  <nav
    {...props.navProps}
    className={cssUtils.cx(styles.root, props.className)}
    aria-label="Путь к странице"
  >
    <ol className={styles.list}>
      {props.items.map((item, index) => {
        const last = index === props.items.length - 1;
        return (
          <li key={`${item.label}-${String(index)}`} className={styles.item}>
            {item.to && !last ? (
              <ActionLink
                to={item.to}
                params={item.params}
                presentation="navigation"
                hierarchy="text"
                className={styles.link}
              >
                {item.label}
              </ActionLink>
            ) : (
              <span className={styles.current} aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);
