import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { useSyncExternalStore } from "react";
import { cssUtils } from "~/shared/lib/css-utils";
import { enhancementState } from "~/shared/lib/enhancement-state";
import type { TabsTypes } from "./tabs.types";
import styles from "./tabs.module.css";

export const TabsPanel: React.FC<TabsTypes.PanelProps> = (props) => {
  const enhanced = useSyncExternalStore(
    enhancementState.subscribe,
    enhancementState.getClientSnapshot,
    enhancementState.getServerSnapshot,
  );
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
