import { Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { backNavigation } from "~/shared/lib/back-navigation";
import type { BackLinkTypes } from "./back-link.types";
import styles from "./back-link.module.css";

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
    <Link className={styles.root} onClick={handleClick} to={fallbackTo}>
      <ArrowLeft aria-hidden="true" size={17} strokeWidth={1.8} />
      <span>{children}</span>
    </Link>
  );
};
