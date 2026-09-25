import { useRouterState } from "@tanstack/react-router";
import { GuestProgressLock } from "~/shared/components/guest-progress-lock";

type Props = Omit<React.ComponentProps<typeof GuestProgressLock>, "returnTo">;

export const GuestProgressLoginNavigation: React.FC<Props> = (props) => {
  const returnTo = useRouterState({
    select: (state) => state.location.pathname,
  });
  return <GuestProgressLock {...props} returnTo={returnTo} />;
};
