import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { cssUtils } from "~/shared/lib/css-utils";
import type { TabsTypes } from "./tabs.types";
import styles from "./tabs.module.css";

export const TabsTab: React.FC<TabsTypes.TabProps> = ({
  value,
  children,
  className,
  ariaLabel,
  disabled,
  tabProps,
}) => (
  <BaseTabs.Tab
    {...tabProps}
    value={value}
    aria-label={ariaLabel}
    className={cssUtils.cx(styles.tab, className)}
    disabled={disabled}
  >
    {children}
  </BaseTabs.Tab>
);
