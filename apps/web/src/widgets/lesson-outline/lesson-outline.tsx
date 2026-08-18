import { useEffect, useMemo, useRef, useState } from "react";
import { FragmentLink } from "~/shared/components/fragment-link";
import { Typography } from "~/shared/components/typography";
import { observeActiveSection } from "~/shared/lib/section-observer";
import { observeLessonOutlineGeometry } from "./lib/browser-adapter";
import {
  buildLessonOutlinePaths,
  type LessonOutlineGeometry,
} from "./lib/lesson-outline-geometry";
import type { LessonOutlineTypes } from "./lesson-outline.types";
import styles from "./lesson-outline.module.css";

export const LessonOutline: React.FC<LessonOutlineTypes.Props> = (props) => {
  const treeRef = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<LessonOutlineGeometry>();
  const [observedActiveId, setObservedActiveId] = useState(
    props.groups[0]?.id ?? "",
  );
  const activeId = props.activeId ?? observedActiveId;
  const activeGroupId = props.groups.find(
    (group) =>
      group.id === activeId || group.items.some((item) => item.id === activeId),
  )?.id;
  const activeGroupIndex = Math.max(
    props.groups.findIndex((group) => group.id === activeGroupId),
    0,
  );
  const connectorPaths = useMemo(
    () =>
      geometry
        ? buildLessonOutlinePaths(geometry, activeId)
        : { paths: [], activePath: undefined },
    [activeId, geometry],
  );

  useEffect(
    function observeActiveSectionFx() {
      return observeActiveSection(
        props.groups.flatMap((group) => [
          group.id,
          ...group.items.map((item) => item.id),
        ]),
        setObservedActiveId,
      );
    },
    [props.groups],
  );

  useEffect(
    function observeOutlineGeometryFx() {
      const tree = treeRef.current;
      if (!tree) return;
      return observeLessonOutlineGeometry(tree, setGeometry);
    },
    [props.groups],
  );

  return (
    <nav className={props.className} aria-label="Содержание урока">
      <div className={styles.headingRow}>
        <Typography.Text className={styles.heading}>
          В этом уроке
        </Typography.Text>
        <Typography.Text
          className={styles.sectionPosition}
          data-section-position
        >
          <span className={styles.visuallyHidden}>
            {`Раздел ${String(activeGroupIndex + 1)} из ${String(props.groups.length)}. `}
          </span>
          <span aria-hidden="true">
            {activeGroupIndex + 1} / {props.groups.length}
          </span>
        </Typography.Text>
      </div>
      <div className={styles.tree} ref={treeRef} data-outline-tree>
        {geometry && geometry.nodes.length > 0 ? (
          <svg
            className={styles.connectors}
            viewBox={`0 0 ${String(geometry.width)} ${String(geometry.height)}`}
            aria-hidden="true"
            focusable="false"
            data-outline-connectors
          >
            <g className={styles.neutralPaths}>
              {connectorPaths.paths.map((path) => (
                <path d={path.d} key={path.id} data-outline-path={path.kind} />
              ))}
            </g>
            {connectorPaths.activePath ? (
              <path
                className={styles.activePath}
                d={connectorPaths.activePath.d}
                data-outline-active-path
              />
            ) : null}
          </svg>
        ) : null}
        <ol className={styles.groups}>
          {props.groups.map((group) => {
            const groupCurrent = group.id === activeId;
            const branchActive = group.id === activeGroupId;
            return (
              <li className={styles.group} key={group.id}>
                <FragmentLink
                  className={styles.groupLink}
                  hash={group.id}
                  icon={false}
                  anchorProps={{
                    "aria-current": groupCurrent ? "location" : undefined,
                    "data-active-branch": branchActive || undefined,
                    "data-outline-link-id": group.id,
                  }}
                >
                  <svg
                    className={`${styles.node} ${styles.parentNode}`}
                    viewBox="0 0 9 9"
                    aria-hidden="true"
                    focusable="false"
                    data-outline-node
                    data-outline-node-id={group.id}
                    data-outline-node-kind="group"
                    data-outline-group-id={group.id}
                  >
                    <circle cx="4.5" cy="4.5" r="4.5" />
                  </svg>
                  <span>{group.label}</span>
                </FragmentLink>
                <ol className={styles.children}>
                  {group.items.map((item) => {
                    const active = item.id === activeId;
                    return (
                      <li className={styles.child} key={item.id}>
                        <FragmentLink
                          className={styles.childLink}
                          hash={item.id}
                          icon={false}
                          anchorProps={{
                            "aria-current": active ? "location" : undefined,
                            "data-outline-link-id": item.id,
                          }}
                        >
                          <svg
                            className={`${styles.node} ${styles.childNode}`}
                            viewBox="0 0 7 7"
                            aria-hidden="true"
                            focusable="false"
                            data-outline-node
                            data-outline-node-id={item.id}
                            data-outline-node-kind="item"
                            data-outline-group-id={group.id}
                          >
                            <circle cx="3.5" cy="3.5" r="3.5" />
                          </svg>
                          <span>{item.label}</span>
                        </FragmentLink>
                      </li>
                    );
                  })}
                </ol>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
