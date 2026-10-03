import { useEffect, useState } from "react";
import { Typography } from "~/shared/components/typography";
import { FragmentLink } from "~/shared/components/fragment-link";
import { fragmentNavigation } from "~/shared/lib/fragment-navigation";
import { observeActiveSection } from "~/shared/lib/section-observer";
import type { LessonOutlineTypes } from "./lesson-outline.types";
import styles from "./page-outline.module.css";

/** Right rail «На этой странице» for one subtopic page (Change 167). */
export const PageOutline: React.FC<LessonOutlineTypes.PageProps> = (props) => {
  const [activeId, setActiveId] = useState(props.items[0]?.id ?? "");
  const [navigation, setNavigation] = useState<{ id: string } | null>(null);
  useEffect(
    function observeActiveSectionFx() {
      return observeActiveSection(
        props.items.map((item) => item.id),
        setActiveId,
      );
    },
    [props.items],
  );
  useEffect(
    function focusNavigationFx() {
      if (navigation) return fragmentNavigation.focusAfterLayout(navigation.id);
    },
    [navigation],
  );
  if (props.items.length < 2) return null;
  return (
    <nav
      className={styles.root}
      aria-labelledby="page-outline-title"
      data-page-outline
    >
      <Typography.Text id="page-outline-title" className={styles.heading}>
        На этой странице
      </Typography.Text>
      <ul className={styles.list}>
        {props.items.map((item) => (
          <li key={item.id}>
            <FragmentLink
              className={styles.link}
              hash={item.id}
              icon={false}
              anchorProps={{
                "aria-current": item.id === activeId ? "location" : undefined,
                onClick: (event) => {
                  if (
                    event.button !== 0 ||
                    event.metaKey ||
                    event.ctrlKey ||
                    event.altKey ||
                    event.shiftKey
                  )
                    return;
                  setNavigation({ id: item.id });
                },
              }}
            >
              {item.label}
            </FragmentLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
