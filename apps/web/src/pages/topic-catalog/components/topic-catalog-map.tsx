import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  examPlan,
  topicCatalog,
  type TopicCatalogTypes,
} from "~/entities/topic-catalog";
import { Tooltip } from "~/shared/components/tooltip";
import { topicCatalogModel } from "../model/topic-catalog-model";
import styles from "../topic-catalog-page.module.css";

type Props = {
  entries: readonly TopicCatalogTypes.Entry[];
  goal: TopicCatalogTypes.Goal;
};

/**
 * Change 185 (F33, F34): the 27 exam tasks as cells in the page head — a
 * topic per cell, 19–21 as one; a dot per task in its level's tone. A cell
 * leads to its row; outside the chosen goal it goes quiet. T3: the map is one
 * Tab stop — arrows, Home and End move between cells (roving tabindex), so
 * the keyboard reaches the rows without 25 stops on the way.
 */
export const TopicCatalogMap: React.FC<Props> = (props) => {
  const [active, setActive] = useState(0);
  const move = (event: React.KeyboardEvent<HTMLOListElement>) => {
    const links = [...event.currentTarget.querySelectorAll("a")];
    const from = links.indexOf(event.target as HTMLAnchorElement);
    if (from < 0) return;
    const next = mapModel.next(links, from, event.key);
    if (next === undefined) return;
    event.preventDefault();
    setActive(next);
    links[next]?.focus();
  };
  return (
    <nav className={styles.map} aria-label="Карта экзамена" data-exam-map>
      <ol className={styles.mapGrid} onKeyDown={move}>
        {props.entries.map((entry, index) => (
          <li
            key={entry.id}
            className={styles.mapCell}
            data-wide={entry.taskNumbers.length > 1 || undefined}
          >
            <Tooltip
              side="top"
              content={`${entry.title} · ${topicCatalogModel.levelLabel(entry.taskNumbers)}${entry.status === "planned" ? " · скоро" : ""}`}
            >
              <Link
                className={styles.mapLink}
                to="/ege"
                hash={`topic-${entry.id}`}
                // only the cell of the row in the address is current
                activeOptions={{ includeHash: true }}
                tabIndex={index === active ? 0 : -1}
                onFocus={() => setActive(index)}
                data-cell-status={entry.status}
                data-in-goal={examPlan.inGoal(entry.taskNumbers, props.goal)}
                aria-label={`${topicCatalog.formatTaskNumbers(entry.taskNumbers)}. ${entry.title}. ${topicCatalogModel.levelLabel(entry.taskNumbers)}${entry.status === "planned" ? ". Скоро" : ""}`}
              >
                <span aria-hidden="true">
                  {entry.taskNumbers.length > 1
                    ? topicCatalogModel.number(entry.taskNumbers)
                    : String(entry.taskNumbers[0])}
                </span>
                <span className={styles.levelDots} aria-hidden="true">
                  {examPlan.levels(entry.taskNumbers).map((level, index) => (
                    <i key={String(index)} data-level={level} />
                  ))}
                </span>
              </Link>
            </Tooltip>
          </li>
        ))}
      </ol>
      <span className={styles.mapLegend} aria-hidden="true">
        {(["basic", "advanced", "high"] as const).map((level) => (
          <span key={level}>
            <i className={styles.levelDot} data-level={level} />
            {examPlan.levelTitles[level].toLocaleLowerCase("ru")}
          </span>
        ))}
        <span>
          <i className={styles.legendSoon} />
          скоро
        </span>
      </span>
    </nav>
  );
};

/** Arrow keys over the grid: left and right along the order, up and down to
 * the nearest cell of the row above or below (19–21 spans three columns). */
const mapModel = {
  next: (links: HTMLAnchorElement[], from: number, key: string) => {
    if (key === "Home") return 0;
    if (key === "End") return links.length - 1;
    if (key === "ArrowLeft") return Math.max(0, from - 1);
    if (key === "ArrowRight") return Math.min(links.length - 1, from + 1);
    if (key !== "ArrowUp" && key !== "ArrowDown") return undefined;
    const box = (link: HTMLAnchorElement) => link.getBoundingClientRect();
    const here = box(links[from]);
    const centre = here.left + here.width / 2;
    const candidates = links
      .map((link, index) => ({ index, rect: box(link) }))
      .filter(({ rect }) =>
        key === "ArrowUp" ? rect.bottom <= here.top : rect.top >= here.bottom,
      );
    if (candidates.length === 0) return from;
    const rowTop =
      key === "ArrowUp"
        ? Math.max(...candidates.map(({ rect }) => rect.top))
        : Math.min(...candidates.map(({ rect }) => rect.top));
    return candidates
      .filter(({ rect }) => Math.abs(rect.top - rowTop) < 1)
      .reduce((best, item) =>
        Math.abs(item.rect.left + item.rect.width / 2 - centre) <
        Math.abs(best.rect.left + best.rect.width / 2 - centre)
          ? item
          : best,
      ).index;
  },
};
