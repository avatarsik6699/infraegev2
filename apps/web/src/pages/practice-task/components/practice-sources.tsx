import { Landmark } from "lucide-react";
import { practiceSource } from "~/entities/practice-task";
import type { components } from "~/shared/api/schema";
import { ExternalLink } from "~/shared/components/external-link";
import styles from "../practice-task-page.module.css";

type Source = components["schemas"]["Source"];

/** F47: the task's source as an item of the metadata line, not a card. */
export const PracticeSources: React.FC<{ sources: Source[] }> = (props) => (
  <>
    {props.sources
      .filter((source) => source.kind !== "unknown")
      .map((source, index) => (
        <span
          key={index}
          className={styles.metaItem}
          title={source.adaptation ?? undefined}
          data-practice-source
        >
          <Landmark size={16} aria-hidden="true" />
          <span className={styles.visuallyHidden}>Источник: </span>
          {source.url ? (
            <ExternalLink href={source.url} newTab>
              {practiceSource.label(source)}
            </ExternalLink>
          ) : (
            practiceSource.label(source)
          )}
        </span>
      ))}
  </>
);
