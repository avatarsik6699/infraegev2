import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { cssUtils } from "~/shared/lib/css-utils";
import type { TabsTypes } from "./tabs.types";
import styles from "./tabs.module.css";

export const TabsRoot: React.FC<TabsTypes.RootProps> = ({
  value,
  onValueChange,
  children,
  className,
}) => (
  <BaseTabs.Root
    value={value}
    onValueChange={(nextValue) => onValueChange(String(nextValue))}
    className={cssUtils.cx(styles.root, className)}
  >
    {children}
  </BaseTabs.Root>
);
