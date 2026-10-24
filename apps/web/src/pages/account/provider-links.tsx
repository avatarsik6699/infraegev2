import { ActionLink } from "~/shared/components/action-link";
import { Button } from "~/shared/components/button";
import { Typography } from "~/shared/components/typography";
import { LoginMethodIcon } from "./components/login-method-icon";
import styles from "./account-page.module.css";
import type { ProviderLinksTypes } from "./provider-links.types";
import { accountPageHelpers } from "./account-page.helpers";

/**
 * Provider sign-in (Changes 208, 209): soft buttons without an outline, each with the provider's
 * own mark, grouped under «… с помощью» as Yandex ID asks.
 */
export const ProviderLinks: React.FC<ProviderLinksTypes.Props> = (props) => (
  <div className={styles.providerSection}>
    <Typography.Text className={styles.providerLabel} tone="muted">
      {props.mode === "sign-in"
        ? "Или войдите с помощью"
        : "Или создайте аккаунт с помощью"}
    </Typography.Text>
    {accountPageHelpers.providers.map((provider) => {
      const mark = (
        <LoginMethodIcon
          provider={provider}
          size={20}
          className={styles.providerMark}
        />
      );
      const label = accountPageHelpers.providerLabels[provider];
      return props.enabledProviders.includes(provider) ? (
        <ActionLink
          key={provider}
          className={styles.providerLink}
          presentation="button"
          hierarchy="soft"
          icon="none"
          to="/api/auth/providers/$provider/start"
          params={{ provider }}
          search={{ return_to: props.returnTo }}
          reloadDocument
          data-provider={provider}
        >
          <span className={styles.providerContent}>
            {mark}
            {label}
          </span>
        </ActionLink>
      ) : (
        <Button
          key={provider}
          className={styles.providerLink}
          hierarchy="soft"
          disabled
          title="Вход через этот сервис пока недоступен"
          iconStart={mark}
        >
          {label}
        </Button>
      );
    })}
  </div>
);
