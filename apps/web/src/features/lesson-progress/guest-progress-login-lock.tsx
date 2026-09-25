import { GuestProgressLoginNavigation } from "./guest-progress-login-navigation";

type Props = React.ComponentProps<typeof GuestProgressLoginNavigation> & {
  enabled?: boolean;
};

export const GuestProgressLoginLock: React.FC<Props> = (props) => {
  const { enabled = true, ...navigationProps } = props;
  if (!enabled) return props.children;
  return <GuestProgressLoginNavigation {...navigationProps} />;
};
