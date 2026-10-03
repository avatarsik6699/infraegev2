import type { components } from "~/shared/api/schema";
import { Typography } from "~/shared/components/typography";
import { ExternalLink } from "~/shared/components/external-link";
import styles from "../practice-task-page.module.css";

/** Source card at the bottom of the task page (v5 mockup `practice-task.html`). */
export const PracticeSources: React.FC<{
  sources: components["schemas"]["Source"][];
}> = (props) => {
  const sources = props.sources.filter((source) => source.kind !== "unknown");
  if (!sources.length) return null;
  return (
    <section className={styles.sources} aria-label="Источник задачи">
      {sources.map((source, index) => (
        <div key={index} className={styles.source}>
          <div className={styles.sourceCopy}>
            <Typography.Text className={styles.sourceTitle}>
              Источник:{" "}
              {source.title ??
                (source.kind === "original"
                  ? "Авторская задача"
                  : "Адаптированная задача")}
              {source.author ? ` · ${source.author}` : ""}
              {source.year ? ` · ${String(source.year)}` : ""}
              {source.original_id ? ` · № ${source.original_id}` : ""}
              {source.role === "copy" ? " · место получения копии" : ""}
            </Typography.Text>
            {source.adaptation ? (
              <Typography.Text tone="muted">
                {source.adaptation}
              </Typography.Text>
            ) : null}
          </div>
          {source.url ? (
            <ExternalLink href={source.url} presentation="action">
              Открыть источник
            </ExternalLink>
          ) : null}
        </div>
      ))}
    </section>
  );
};
