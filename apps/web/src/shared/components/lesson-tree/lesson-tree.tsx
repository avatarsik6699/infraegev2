import { Link } from "@tanstack/react-router";
import { Check, ChevronRight, Lock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ResponsiveDisclosure } from "~/shared/components/responsive-disclosure";
import type { LessonTreeTypes } from "./lesson-tree.types";
import styles from "./lesson-tree.module.css";

type FileLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
  params?: Record<string, string>;
  "data-done"?: boolean;
};
const FileLink = Link as unknown as React.FC<FileLinkProps>;

/**
 * F37: the lesson rail as a quiet file tree — topics or modules are
 * folders, subtopics or lessons are files. The current file is marked by
 * the orange bar on the tree line; weight never changes (F23).
 */
export const LessonTree: React.FC<LessonTreeTypes.Props> = (props) => {
  const [expanded, setExpanded] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  useEffect(function revealCurrentFileFx() {
    if (navRef.current) revealCurrent(navRef.current);
  }, []);

  return (
    <nav
      ref={navRef}
      {...props.navProps}
      className={styles.root}
      aria-label={props.ariaLabel}
    >
      <ResponsiveDisclosure
        label={props.disclosureLabel}
        expanded={expanded}
        onExpandedChange={setExpanded}
      >
        <div className={styles.caption}>{props.rootLabel}</div>
        <ul className={styles.tree}>
          {props.folders.map((folder) => (
            <li key={folder.id}>
              <details open={folder.open} data-tree-folder={folder.id}>
                <summary className={styles.folder}>
                  <ChevronRight className={styles.chevron} aria-hidden />
                  <span className={styles.marker} aria-hidden="true">
                    {folder.marker}
                  </span>
                  <span className={styles.label}>{folder.label}</span>
                </summary>
                <ol className={styles.branch}>
                  {folder.files.map((file) => {
                    const content = (
                      <>
                        <span className={styles.marker} aria-hidden="true">
                          {file.marker}
                        </span>
                        {/* Change 186 (F25, F26): a done file gets a green
                            check before its label, kept in its own slot. */}
                        <span className={styles.check} aria-hidden="true">
                          {file.done ? <Check strokeWidth={2.5} /> : null}
                        </span>
                        <span className={styles.label}>
                          {file.label}
                          {file.count ? (
                            <span className={styles.count}>{file.count}</span>
                          ) : null}
                          {file.note ? (
                            <span className={styles.visuallyHidden}>
                              {`, ${file.note}`}
                            </span>
                          ) : null}
                          {file.done && props.doneLabel ? (
                            <span className={styles.visuallyHidden}>
                              {` (${props.doneLabel})`}
                            </span>
                          ) : null}
                          {file.locked ? (
                            <span className={styles.visuallyHidden}>
                              {" (с полным доступом)"}
                            </span>
                          ) : null}
                        </span>
                        {file.locked ? (
                          <Lock className={styles.lock} aria-hidden="true" />
                        ) : null}
                      </>
                    );
                    return (
                      <li key={file.id}>
                        {file.groupLabel ? (
                          <span className={styles.group} aria-hidden="true">
                            {file.groupLabel}
                          </span>
                        ) : null}
                        {file.to ? (
                          <FileLink
                            className={styles.file}
                            to={file.to}
                            params={file.params}
                            aria-current={file.current ? "page" : undefined}
                            data-done={file.done || undefined}
                            onClick={() => setExpanded(false)}
                          >
                            {content}
                          </FileLink>
                        ) : (
                          <span className={styles.file} data-planned>
                            {content}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </details>
            </li>
          ))}
        </ul>
        {props.progress ? (
          <div className={styles.progress}>{props.progress}</div>
        ) : null}
      </ResponsiveDisclosure>
    </nav>
  );
};

/**
 * Change 186 (F41): a late topic's open folder can sit below the rail's first
 * screen; scroll the rail itself (never the page) so the current file shows.
 */
function revealCurrent(nav: HTMLElement): void {
  const current = nav.querySelector<HTMLElement>(
    `.${styles.branch} [aria-current="page"]`,
  );
  if (!current) return;
  let scroller = nav.parentElement;
  while (
    scroller &&
    !/(auto|scroll)/u.test(getComputedStyle(scroller).overflowY)
  )
    scroller = scroller.parentElement;
  if (!scroller || scroller.scrollHeight <= scroller.clientHeight) return;
  const box = scroller.getBoundingClientRect();
  const item = current.getBoundingClientRect();
  if (item.top >= box.top && item.bottom <= box.bottom) return;
  scroller.scrollTop += item.top - box.top - box.height / 3;
}
