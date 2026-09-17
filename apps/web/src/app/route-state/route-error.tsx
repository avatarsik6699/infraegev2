import { RotateCw } from "lucide-react";
import {
  useRouter,
  useRouterState,
  type AnyRouteMatch,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ActionLink } from "~/shared/components/action-link";
import { Button } from "~/shared/components/button";
import { StatusScene } from "~/shared/components/status-scene";
import { documentRecovery } from "~/shared/lib/document-recovery";
import { RouteStateFrame } from "./route-state-frame";

export const RouteError: React.FC<ErrorComponentProps> = (props) => {
  const router = useRouter();
  const state = useRouterState();
  const loaderError = state.matches.some(
    (match: AnyRouteMatch) => match.status === "error",
  );
  const renderError = Boolean(props.info) && !loaderError;
  const [retrying, setRetrying] = useState(false);
  const retryInFlight = useRef(false);
  const chunkError = documentRecovery.isChunkLoadError(props.error);

  const retry = async () => {
    if (retryInFlight.current) return;
    retryInFlight.current = true;
    setRetrying(true);
    try {
      if (chunkError) documentRecovery.reload();
      else if (renderError) props.reset();
      else await router.invalidate();
    } finally {
      retryInFlight.current = false;
      setRetrying(false);
    }
  };

  return (
    <RouteStateFrame>
      <StatusScene
        kind="error"
        title="Не удалось загрузить страницу"
        description="Попробуйте ещё раз или вернитесь на главную."
      >
        <Button
          hierarchy="quiet"
          iconStart={<RotateCw aria-hidden="true" size={18} />}
          loading={retrying}
          onClick={() => {
            void retry();
          }}
        >
          {chunkError ? "Обновить страницу" : "Повторить"}
        </Button>
        <ActionLink to="/" hierarchy="text" icon="back">
          На главную
        </ActionLink>
      </StatusScene>
    </RouteStateFrame>
  );
};
