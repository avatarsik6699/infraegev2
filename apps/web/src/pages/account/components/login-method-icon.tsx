import { AtSign } from "lucide-react";
import type { Provider } from "~/features/account";

type Props = {
  provider: Provider | "email";
  className?: string;
  /** Rendered size in pixels; the brand marks keep their own proportions. */
  size?: number;
};

// Change 208: the providers' own marks, as their sign-in guidelines require. Yandex: the red
// circle with the white «Я» (Yandex ID button assets); VK: the VK mark in VK blue (simple-icons).
const YandexMark: React.FC<{ size: number; className?: string }> = (props) => (
  <svg
    width={props.size}
    height={props.size}
    viewBox="0 0 44 44"
    className={props.className}
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="22" cy="22" r="22" fill="#FC3F1D" />
    <path
      fill="#fff"
      d="M24.7406 33.9778H29.0888V9.04445H22.7591C16.3928 9.04445 13.0537 12.303 13.0537 17.1176C13.0537 21.2731 15.2186 23.6164 19.0531 26.1609L21.3831 27.6987L18.3926 25.1907L12.4666 33.9778H17.1817L23.5113 24.5317L21.3097 23.0672C18.6494 21.2731 17.3468 19.8818 17.3468 16.8613C17.3468 14.2069 19.2182 12.4128 22.7775 12.4128H24.7222V33.9778H24.7406Z"
    />
  </svg>
);

const VkMark: React.FC<{ size: number; className?: string }> = (props) => (
  <svg
    width={props.size}
    height={props.size}
    viewBox="0 0 24 24"
    className={props.className}
    aria-hidden="true"
    focusable="false"
  >
    <rect x="2" y="2" width="20" height="20" fill="#fff" />
    <path
      fill="#0077FF"
      d="m9.489.004.729-.003h3.564l.73.003.914.01.433.007.418.011.403.014.388.016.374.021.36.025.345.03.333.033c1.74.196 2.933.616 3.833 1.516.9.9 1.32 2.092 1.516 3.833l.034.333.029.346.025.36.02.373.025.588.012.41.013.644.009.915.004.98-.001 3.313-.003.73-.01.914-.007.433-.011.418-.014.403-.016.388-.021.374-.025.36-.03.345-.033.333c-.196 1.74-.616 2.933-1.516 3.833-.9.9-2.092 1.32-3.833 1.516l-.333.034-.346.029-.36.025-.373.02-.588.025-.41.012-.644.013-.915.009-.98.004-3.313-.001-.73-.003-.914-.01-.433-.007-.418-.011-.403-.014-.388-.016-.374-.021-.36-.025-.345-.03-.333-.033c-1.74-.196-2.933-.616-3.833-1.516-.9-.9-1.32-2.092-1.516-3.833l-.034-.333-.029-.346-.025-.36-.02-.373-.025-.588-.012-.41-.013-.644-.009-.915-.004-.98.001-3.313.003-.73.01-.914.007-.433.011-.418.014-.403.016-.388.021-.374.025-.36.03-.345.033-.333c.196-1.74.616-2.933 1.516-3.833.9-.9 2.092-1.32 3.833-1.516l.333-.034.346-.029.36-.025.373-.02.588-.025.41-.012.644-.013.915-.009ZM6.79 7.3H4.05c.13 6.24 3.25 9.99 8.72 9.99h.31v-3.57c2.01.2 3.53 1.67 4.14 3.57h2.84c-.78-2.84-2.83-4.41-4.11-5.01 1.28-.74 3.08-2.54 3.51-4.98h-2.58c-.56 1.98-2.22 3.78-3.8 3.95V7.3H10.5v6.92c-1.6-.4-3.62-2.34-3.71-6.92Z"
    />
  </svg>
);

export const LoginMethodIcon: React.FC<Props> = (props) => {
  const size = props.size ?? 18;
  switch (props.provider) {
    case "email":
      return (
        <AtSign
          size={size}
          strokeWidth={1.8}
          aria-hidden
          className={props.className}
        />
      );
    case "vk":
      return <VkMark size={size} className={props.className} />;
    case "yandex":
      return <YandexMark size={size} className={props.className} />;
  }
};
