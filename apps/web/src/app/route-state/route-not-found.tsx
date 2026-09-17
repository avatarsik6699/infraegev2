import { ActionLink } from "~/shared/components/action-link";
import { StatusScene } from "~/shared/components/status-scene";
import { RouteStateFrame } from "./route-state-frame";

export const RouteNotFound: React.FC = () => (
  <RouteStateFrame>
    <StatusScene
      kind="code"
      title="Такой страницы нет"
      code="404"
      description="Проверьте адрес или вернитесь на главную."
    >
      <ActionLink to="/" hierarchy="text" icon="back">
        На главную
      </ActionLink>
    </StatusScene>
  </RouteStateFrame>
);
