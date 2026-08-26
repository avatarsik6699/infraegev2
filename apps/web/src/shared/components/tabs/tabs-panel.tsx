import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { cssUtils } from "~/shared/lib/css-utils";
import type { TabsTypes } from "./tabs.types";
import styles from "./tabs.module.css";

export const TabsPanel: React.FC<TabsTypes.PanelProps> = (props) => {
  const enhanced = useIsEnhanced();
  const className = cssUtils.cx(styles.panel, props.className);

  if (!enhanced) {
    return (
      <div
        {...props.panelProps}
        className={className}
        data-unenhanced-tab-panel=""
      >
        {props.children}
      </div>
    );
  }

  return (
    <BaseTabs.Panel
      {...props.panelProps}
      value={props.value}
      keepMounted
      tabIndex={props.focusable ? 0 : undefined}
      className={className}
    >
      {props.children}
    </BaseTabs.Panel>
  );
};
