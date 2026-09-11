import { useEffect, useState } from "react";
import { ResponsiveDisclosure } from "~/shared/components/responsive-disclosure";
import { fragmentNavigation } from "~/shared/lib/fragment-navigation";
import { LessonOutlineContent } from "./lesson-outline-content";
import { observeActiveSection } from "~/shared/lib/section-observer";
import type { LessonOutlineTypes } from "./lesson-outline.types";

export const LessonOutline: React.FC<LessonOutlineTypes.Props> = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [navigation, setNavigation] = useState<{ id: string } | null>(null);
  useEffect(
    function focusNavigationFx() {
      if (navigation) return fragmentNavigation.focusAfterLayout(navigation.id);
    },
    [navigation],
  );
  const handleNavigate = (
    id: string,
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey
    )
      return;
    setExpanded(false);
    setNavigation({ id });
  };
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
    <nav
      className={props.className}
      aria-label="Содержание урока"
      data-presentation="study"
    >
      <ResponsiveDisclosure
        label="Содержание урока"
        expanded={expanded}
        onExpandedChange={setExpanded}
      >
        <LessonOutlineContent
          groups={props.groups}
          activeId={activeId}
          activeGroupId={activeGroupId}
          activeGroupIndex={activeGroupIndex}
          onNavigate={handleNavigate}
        />
      </ResponsiveDisclosure>
    </nav>
  );
};
