import type { AccountPageTypes } from "./account-page.types";

export namespace AccountFormTypes {
  export type Props = {
    mode: AccountPageTypes.Mode;
    token?: string;
    pending: boolean;
    cooldown: number;
    onSubmit: (
      submittedMode: AccountPageTypes.Mode,
      event: Parameters<
        NonNullable<React.ComponentProps<"form">["onSubmit"]>
      >[0],
    ) => Promise<void>;
  };
}
