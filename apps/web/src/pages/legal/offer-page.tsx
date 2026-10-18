import { ActionLink } from "~/shared/components/action-link";
import { Typography } from "~/shared/components/typography";
import { LegalDocument } from "./legal-document";
import { offerVersions } from "./model/legal-documents";
import styles from "./legal-page.module.css";

const dates = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

type Props = { version?: string };

/** /oferta: the current offer; /oferta/<date>: an earlier edition, kept as accepted. */
export const OfferPage: React.FC<Props> = (props) => {
  const current = offerVersions[0];
  const shown =
    offerVersions.find((offer) => offer.version === props.version) ?? current;
  if (!shown) return null;
  const others = offerVersions.filter((offer) => offer !== shown);
  return (
    <LegalDocument
      markdown={shown.text}
      aside={
        <Typography.Text className={styles.editions}>
          {shown === current ? "Действующая редакция" : "Прежняя редакция"}
          {others.length ? " · другие: " : null}
          {others.map((offer, index) => (
            <span key={offer.version}>
              {index ? ", " : null}
              <ActionLink
                presentation="inline"
                hierarchy="text"
                to={offer === current ? "/oferta" : `/oferta/${offer.version}`}
              >
                {dates.format(new Date(offer.version))}
              </ActionLink>
            </span>
          ))}
        </Typography.Text>
      }
    />
  );
};
