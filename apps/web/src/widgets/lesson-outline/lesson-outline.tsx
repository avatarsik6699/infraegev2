import { useEffect, useState } from "react";
import { FragmentLink } from "~/shared/components/fragment-link";
import { Typography } from "~/shared/components/typography";
import { observeActiveSection } from "~/shared/lib/section-observer";
import type { LessonOutlineTypes } from "./lesson-outline.types";
import styles from "./lesson-outline.module.css";

export const LessonOutline: React.FC<LessonOutlineTypes.Props> = (props) => {
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
      <div className={styles.tree} data-outline-tree>
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
