import { ExternalLink } from "~/shared/components/external-link";
import { Typography } from "~/shared/components/typography";
import { LoginMethodIcon } from "./components/login-method-icon";
import styles from "./account-page.module.css";
import type { ProviderLinksTypes } from "./provider-links.types";
import { accountPageHelpers } from "./account-page.helpers";

export const ProviderLinks: React.FC<ProviderLinksTypes.Props> = (props) => (
  <div className={styles.providerSection}>
    <Typography.Text className={styles.providerLabel} tone="muted">
      {props.mode === "sign-in"
        ? "Или войдите через"
        : "Или создайте аккаунт через"}
    </Typography.Text>
    {accountPageHelpers.providers.map((provider) =>
      props.enabledProviders.includes(provider) ? (
        <ExternalLink
          className={styles.providerLink}
          key={provider}
          href={`/api/auth/providers/${provider}/start?return_to=${encodeURIComponent(props.returnTo)}`}
        >
          <LoginMethodIcon provider={provider} />
          {accountPageHelpers.providerLabels[provider]}
        </ExternalLink>
      ) : (
        <button
          className={styles.providerLink}
          key={provider}
          type="button"
          disabled
          title="Вход через этот сервис пока недоступен"
        >
          <LoginMethodIcon provider={provider} />
          {accountPageHelpers.providerLabels[provider]}
        </button>
      ),
    )}
  </div>
);
