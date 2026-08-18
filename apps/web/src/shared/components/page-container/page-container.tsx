import { cssUtils } from "~/shared/lib/css-utils";
import type { PageContainerTypes } from "./page-container.types";
import styles from "./page-container.module.css";

export const PageContainer: React.FC<PageContainerTypes.Props> = ({
  component: Component = "main",
  measure = "wide",
  className,
  children,
  ...containerProps
}) => {
  return (
    <Component
      {...containerProps}
      data-measure={measure}
      className={cssUtils.cx(styles.root, className)}
    >
      {children}
    </Component>
  );
};
