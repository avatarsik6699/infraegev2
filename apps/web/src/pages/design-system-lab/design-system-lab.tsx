import { useState } from "react";
import {
  TabsList,
  TabsPanel,
  TabsRoot,
  TabsTab,
} from "~/shared/components/tabs";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { PublicHeader } from "~/widgets/public-header";
import { ComponentsCatalog } from "./components-catalog";
import { dashboardTabDefinitions } from "./design-system-lab.constants";
import styles from "./design-system-lab.module.css";
import { SystemCatalog } from "./system-catalog";
import { WidgetsCatalog } from "./widgets-catalog";

export const DesignSystemLab: React.FC = () => {
  const [dashboardTab, setDashboardTab] = useState("system");
  const enhanced = useIsEnhanced();

  return (
    <div
      className={styles.page}
      data-alchimia-lab-root
      data-enhanced={enhanced || undefined}
    >
      <PublicHeader />
      <main className={styles.dashboard}>
        <TabsRoot
          className={styles.dashboardTabs}
          value={dashboardTab}
          onValueChange={setDashboardTab}
        >
          <div className={styles.dashboardTabBar}>
            <TabsList
              label="Уровни дизайн-системы"
              hidden={!enhanced}
              className={
                enhanced ? styles.dashboardTabList : styles.enhancedOnly
              }
            >
              {dashboardTabDefinitions.map((tab) => (
                <TabsTab
                  key={tab.value}
                  value={tab.value}
                  className={styles.dashboardTab}
                >
                  <span>{tab.label}</span>
                  <small>{tab.description}</small>
                </TabsTab>
              ))}
            </TabsList>
          </div>

          <TabsPanel
            value="system"
            className={styles.dashboardPanel}
            panelProps={{ "data-dashboard-panel": "system" }}
          >
            <SystemCatalog />
          </TabsPanel>
          <TabsPanel
            value="components"
            className={styles.dashboardPanel}
            panelProps={{ "data-dashboard-panel": "components" }}
          >
            <ComponentsCatalog />
          </TabsPanel>
          <TabsPanel
            value="widgets"
            className={styles.dashboardPanel}
            panelProps={{ "data-dashboard-panel": "widgets" }}
          >
            <WidgetsCatalog />
          </TabsPanel>
        </TabsRoot>
      </main>
    </div>
  );
};
