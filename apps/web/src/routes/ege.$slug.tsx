import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import {
  findOutlineSubtopicBySection,
  findTopicOutline,
} from "~/entities/lesson";
import { legacyTopicRouteSlugs } from "~/shared/config/legacy-routes";

// The topic URL opens its first subtopic page (Change 167). The browser keeps an old
// `#section` across the server redirect; client navigations resolve it here directly.
export const Route = createFileRoute("/ege/$slug")({
  beforeLoad: ({ params, location }) => {
    const renamed = legacyTopicRouteSlugs[params.slug];
    if (renamed)
      throw redirect({
        to: "/ege/$slug",
        params: { slug: renamed },
        hash: location.hash || undefined,
        statusCode: 301,
      });
    // Change 222: the redirect reads the outline; no topic content loads here.
    const outline = findTopicOutline(params.slug);
    const first = outline?.subtopics[0];
    if (!outline || outline.status !== "published" || !first) throw notFound();
    const hash = location.hash || undefined;
    const owner = hash
      ? findOutlineSubtopicBySection(outline, hash)
      : undefined;
    throw redirect({
      to: "/ege/$slug/$subtopic",
      params: { slug: params.slug, subtopic: (owner ?? first).slug },
      hash,
      statusCode: 301,
    });
  },
});
