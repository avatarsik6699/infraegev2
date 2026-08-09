import { Link } from "@tanstack/react-router";
import type { ResolvedContentLink } from "~/content/loader";

/**
 * "Эта тема легче даётся, если понимать [Python: списки] → перейти" (docs/SPEC.md §5.2).
 * Rendered from a Topic's `prerequisites`/`related_topics`/`unlocks_topics`, already resolved to
 * routes by the page's loader (see `~/content/loader#resolveContentLink`) — not from content_blocks.
 */
export function PrerequisiteCallout({
  heading,
  links,
}: {
  heading: string;
  links: ResolvedContentLink[];
}) {
  if (links.length === 0) return null;

  return (
    <aside role="note" data-tone="prerequisite">
      <p>{heading}</p>
      <ul>
        {links.map((link) => (
          <li key={link.id}>
            <Link to={link.href}>{link.title} →</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
