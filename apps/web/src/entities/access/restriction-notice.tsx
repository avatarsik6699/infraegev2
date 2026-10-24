import { ExternalLink } from "~/shared/components/external-link";
import { Typography } from "~/shared/components/typography";
import type { AccessTypes } from "./access.types";
import styles from "./restriction-notice.module.css";

const DATE = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Moscow",
});

const titles: Record<AccessTypes.Restriction["kind"], string> = {
  warning: "Доступ к аккаунту — личный",
  suspension: "Платный доступ приостановлен",
  termination: "Платный доступ прекращён",
};

/**
 * Change 198 (SPEC §6.2): a manual measure of the operator, said plainly: what
 * happened, why, until when, and where to write when the learner disagrees.
 */
export const RestrictionNotice: React.FC<{
  restriction: AccessTypes.Restriction;
  headingOrder: 2 | 3;
}> = (props) => {
  const { kind, reason, until, contact } = props.restriction;
  let lead = `Причина: ${reason}.`;
  if (kind === "suspension" && until)
    lead = `До ${DATE.format(new Date(until))}. ${lead}`;
  if (kind === "termination")
    lead = `${lead} Стоимость неиспользованных дней вернём на карту.`;
  return (
    <section
      className={styles.root}
      aria-labelledby="restriction-title"
      data-restriction={kind}
    >
      <Typography.Title
        order={props.headingOrder}
        id="restriction-title"
        className={styles.title}
      >
        {titles[kind]}
      </Typography.Title>
      <Typography.Text className={styles.text}>{lead}</Typography.Text>
      <Typography.Text className={styles.text}>
        {kind === "warning"
          ? "Если пароль знает кто-то ещё, смените его. Аккаунт, прогресс и бесплатные материалы сохраняются."
          : "Аккаунт, прогресс и бесплатные материалы сохраняются."}{" "}
        Не согласны — напишите на{" "}
        <ExternalLink href={`mailto:${contact}`}>{contact}</ExternalLink>,
        ответим в течение трёх рабочих дней.
      </Typography.Text>
    </section>
  );
};
