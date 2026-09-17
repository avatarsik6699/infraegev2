import { FragmentLink } from "~/shared/components/fragment-link";
import { Typography } from "~/shared/components/typography";
import type { LessonOutlineTypes } from "./lesson-outline.types";
import styles from "./lesson-outline.module.css";

export const LessonOutlineContent: React.FC<LessonOutlineTypes.ContentProps> = (
  props,
) => (
  <>
    <div className={styles.headingRow}>
      <Typography.Text className={styles.heading}>В этом уроке</Typography.Text>
      <Typography.Text className={styles.sectionPosition} data-section-position>
        <span className={styles.visuallyHidden}>
          {`Раздел ${String(props.activeGroupIndex + 1)} из ${String(props.groups.length)}. `}
        </span>
        <span aria-hidden="true">
          {props.activeGroupIndex + 1} / {props.groups.length}
        </span>
      </Typography.Text>
    </div>
    <div data-outline-tree>
      <ol className={styles.groups}>
        {props.groups.map((group) => {
          const groupCurrent = group.id === props.activeId;
          const branchActive = group.id === props.activeGroupId;
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
                  onClick: (event) => props.onNavigate(group.id, event),
                }}
              >
                <span>{group.label}</span>
              </FragmentLink>
              <ol className={styles.children}>
                {group.items.map((item) => {
                  const active = item.id === props.activeId;
                  return (
                    <li className={styles.child} key={item.id}>
                      <FragmentLink
                        className={styles.childLink}
                        hash={item.id}
                        icon={false}
                        anchorProps={{
                          "aria-current": active ? "location" : undefined,
                          "data-outline-link-id": item.id,
                          onClick: (event) => props.onNavigate(item.id, event),
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
  </>
);
