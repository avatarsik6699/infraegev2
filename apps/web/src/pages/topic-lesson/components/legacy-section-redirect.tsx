import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { findSubtopicBySection, type LessonContent } from "~/entities/lesson";

const practiceSections = new Set(["exam-focus", "practice", "result"]);

/** Moves an old `/ege/{topic}#{section}` link to the page that now owns the section. */
export const LegacySectionRedirect: React.FC<{
  lesson: LessonContent.Definition;
  /** Fragment targets rendered on the current page. */
  sections: readonly string[];
}> = (props) => {
  const navigate = useNavigate();
  const hash = useRouterState({ select: (state) => state.location.hash });
  useEffect(
    function resolveLegacySectionFx() {
      const section = decodeURIComponent(hash);
      if (!section || props.sections.includes(section)) return;
      const slug = props.lesson.routeSlug;
      if (practiceSections.has(section)) {
        void navigate({
          to: "/ege/$slug/praktika",
          params: { slug },
          hash: section,
          replace: true,
        });
        return;
      }
      const owner = findSubtopicBySection(props.lesson, section);
      if (owner)
        void navigate({
          to: "/ege/$slug/$subtopic",
          params: { slug, subtopic: owner.slug },
          hash: section,
          replace: true,
        });
    },
    [hash, navigate, props.lesson, props.sections],
  );
  return null;
};
