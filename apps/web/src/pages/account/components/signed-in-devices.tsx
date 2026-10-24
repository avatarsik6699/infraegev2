import { useEffect, useState } from "react";
import { accountApi, useAccountSession } from "~/features/account";
import { Button } from "~/shared/components/button";
import { cssUtils } from "~/shared/lib/css-utils";
import { ExternalLink } from "~/shared/components/external-link";
import { InfoPopover } from "~/shared/components/info-popover";
import { Typography } from "~/shared/components/typography";
import styles from "../account-page.module.css";

type Device = Awaited<ReturnType<typeof accountApi.sessions>>[number];

const TIME = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Moscow",
});

/** Change 198 (SPEC §6.2): where the account is signed in, with sign-out. */
export const SignedInDevices: React.FC = () => {
  const session = useAccountSession();
  const [devices, setDevices] = useState<readonly Device[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [pending, setPending] = useState(false);
  const load = async () => {
    try {
      setDevices(await accountApi.sessions());
      setFailed(false);
    } catch {
      setFailed(true);
    }
  };
  useEffect(function devicesFx() {
    let stopped = false;
    accountApi.sessions().then(
      (list) => {
        if (!stopped) setDevices(list);
      },
      () => {
        if (!stopped) setFailed(true);
      },
    );
    return () => {
      stopped = true;
    };
  }, []);
  const act = async (action: () => Promise<void>) => {
    setPending(true);
    try {
      await action();
      await load();
    } catch {
      setFailed(true);
    } finally {
      setPending(false);
    }
  };
  return (
    <section className={styles.profileSettings} aria-labelledby="devices-title">
      <div className={styles.sectionHeading}>
        <Typography.Title order={2} id="devices-title">
          Где выполнен вход
        </Typography.Title>
        <InfoPopover label="Об устройствах">
          Доступ личный: одновременно можно войти не более чем на трёх
          устройствах. При входе на четвёртом завершится сеанс, которым дольше
          всего не пользовались.
        </InfoPopover>
      </div>
      {devices === null && !failed ? (
        <Typography.Text tone="muted" role="status">
          Загружаем устройства…
        </Typography.Text>
      ) : null}
      {failed ? (
        <Typography.Text className={styles.error} role="alert">
          Не удалось загрузить устройства. Обновите страницу.
        </Typography.Text>
      ) : null}
      {devices ? (
        <ul className={styles.methods}>
          {devices.map((device) => (
            <li
              className={cssUtils.cx(styles.method, styles.device)}
              key={device.id}
            >
              <div className={styles.methodIdentity}>
                <Typography.Text>{device.label}</Typography.Text>
                <Typography.Text tone="muted" className={styles.methodStatus}>
                  {[
                    device.city,
                    device.current
                      ? "это устройство"
                      : TIME.format(new Date(device.last_seen_at)),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </Typography.Text>
              </div>
              {!device.current ? (
                <div className={styles.methodActions}>
                  <Button
                    type="button"
                    hierarchy="quiet"
                    density="compact"
                    disabled={pending}
                    aria-label={`Выйти на устройстве ${device.label}`}
                    onClick={() => {
                      void act(() =>
                        accountApi.endSession(device.id, session.csrfToken),
                      );
                    }}
                  >
                    Выйти
                  </Button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
      {devices?.some((device) => device.city) ? (
        <Typography.Text tone="muted" className={styles.methodStatus}>
          Город определён по IP-адресу:{" "}
          <ExternalLink href="https://db-ip.com">
            IP Geolocation by DB-IP
          </ExternalLink>
          .
        </Typography.Text>
      ) : null}
      {devices && devices.length > 1 ? (
        <div>
          <Button
            type="button"
            hierarchy="secondary"
            disabled={pending}
            onClick={() => {
              void act(() => accountApi.endOtherSessions(session.csrfToken));
            }}
          >
            Выйти на других устройствах
          </Button>
        </div>
      ) : null}
    </section>
  );
};
