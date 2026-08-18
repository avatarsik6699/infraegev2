import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { cssUtils } from "~/shared/lib/css-utils";
import type { TabsTypes } from "./tabs.types";
import styles from "./tabs.module.css";

export const TabsList: React.FC<TabsTypes.ListProps> = ({
  label,
  children,
  className,
  hidden,
}) => (
  <BaseTabs.List
    activateOnFocus
    aria-label={label}
    className={cssUtils.cx(styles.list, className)}
    hidden={hidden}
  >
    {children}
  </BaseTabs.List>
);
