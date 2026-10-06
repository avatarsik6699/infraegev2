import { Landmark } from "lucide-react";
import type { components } from "~/shared/api/schema";
import { ExternalLink } from "~/shared/components/external-link";
import styles from "../practice-task-page.module.css";

type Source = components["schemas"]["Source"];

/** «Демоверсия 2023», never «Демоверсия 2023 · 2023». */
function sourceLabel(source: Source) {
  const title =
    source.title ??
    (source.kind === "original" ? "Авторская задача" : "Адаптированная задача");
  const year =
    source.year && !title.includes(String(source.year))
      ? ` · ${String(source.year)}`
      : "";
  const author = source.author ? ` · ${source.author}` : "";
  const number = source.original_id ? ` · № ${source.original_id}` : "";
  return `${title}${author}${year}${number}`;
}

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
            <ExternalLink href={source.url}>{sourceLabel(source)}</ExternalLink>
          ) : (
            sourceLabel(source)
          )}
          {source.role === "copy" ? " (копия)" : ""}
        </span>
      ))}
  </>
);
