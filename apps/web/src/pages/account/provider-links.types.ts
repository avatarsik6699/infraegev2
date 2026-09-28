import { type Provider } from "~/features/account";

export namespace ProviderLinksTypes {
  export type Props = {
    mode: "sign-in" | "register";
    returnTo: string;
    enabledProviders: readonly Provider[];
  };
}
