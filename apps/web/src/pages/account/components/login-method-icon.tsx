import { AtSign, MessageCircle, Search } from "lucide-react";
import type { Provider } from "~/features/account";

type Props = {
  provider: Provider | "email";
  className?: string;
};

export const LoginMethodIcon: React.FC<Props> = (props) => {
  const iconProps = {
    size: 18,
    strokeWidth: 1.8,
    "aria-hidden": true,
  } as const;
  switch (props.provider) {
    case "email":
      return <AtSign {...iconProps} className={props.className} />;
    case "vk":
      return <MessageCircle {...iconProps} className={props.className} />;
    case "yandex":
      return <Search {...iconProps} className={props.className} />;
  }
};
