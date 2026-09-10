import { StatusScene } from "~/shared/components/status-scene";
import { RouteStateFrame } from "./route-state-frame";

export const RoutePending: React.FC = () => (
  <RouteStateFrame>
    <StatusScene
      kind="pending"
      title="Загружаем страницу…"
      description="Подготавливаем материалы"
    />
  </RouteStateFrame>
);
