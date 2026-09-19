import type { components } from "~/shared/api/schema";
import { Typography } from "~/shared/components/typography";
import { ExternalLink } from "~/shared/components/external-link";
import styles from "../practice-task-page.module.css";

export const PracticeSources: React.FC<{
  sources: components["schemas"]["Source"][];
}> = (props) => (
  <div className={styles.sources}>
    {props.sources
      .filter((source) => source.kind !== "unknown")
      .map((source, index) => (
        <div key={index}>
          <Typography.Text tone="muted" variant="caption">
            Источник:{" "}
            {source.title ??
              (source.kind === "original"
                ? "Авторская задача"
                : "Адаптированная задача")}
            {source.author ? ` · ${source.author}` : ""}
            {source.year ? ` · ${source.year}` : ""}
            {source.original_id ? ` · № ${source.original_id}` : ""}
            {source.role === "copy" ? " · место получения копии" : ""}
          </Typography.Text>
          {source.adaptation && (
            <Typography.Text tone="muted" variant="caption">
              {source.adaptation}
            </Typography.Text>
          )}
          {source.url && (
            <ExternalLink href={source.url}>Открыть источник</ExternalLink>
          )}
        </div>
      ))}
  </div>
);
