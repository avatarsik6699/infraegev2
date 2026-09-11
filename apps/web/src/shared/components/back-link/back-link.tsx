import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { ActionLink } from "~/shared/components/action-link";
import { backNavigation } from "~/shared/lib/back-navigation";
import type { BackLinkTypes } from "./back-link.types";

export const BackLink: React.FC<BackLinkTypes.Props> = ({
  fallbackTo = "/",
  children,
}) => {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    const shouldUseHistory = backNavigation.shouldUseHistory({
      altKey: event.altKey,
      button: event.button,
      canGoBack,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
    });

    if (!shouldUseHistory) return;

    event.preventDefault();
    router.history.back();
  };

  return (
    <ActionLink
      hierarchy="text"
      icon="back"
      onClick={handleClick}
      to={fallbackTo}
    >
      {children}
    </ActionLink>
  );
};
