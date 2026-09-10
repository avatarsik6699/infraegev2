import { PageContainer } from "~/shared/components/page-container";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import styles from "./route-state.module.css";

export const RouteStateFrame: React.FC<{ children: React.ReactNode }> = (
  props,
) => (
  <div className={styles.page} data-route-state-frame>
    <PublicHeader />
    <PageContainer measure="full" className={styles.main}>
      {props.children}
    </PageContainer>
    <PublicFooter />
  </div>
);
