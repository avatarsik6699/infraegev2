import { Link } from "@tanstack/react-router";
import type { ResolvedContentLink } from "~/entities/content/lib/content-link";

type Props = {
  heading: string;
  links: ResolvedContentLink[];
};

/**
 * "Эта тема легче даётся, если понимать [Python: списки] → перейти" (docs/SPEC.md §5.2).
 * Rendered from a Topic's `prerequisites`/`related_topics`/`unlocks_topics`, already resolved to
 * routes by the page's loader (see `~/entities/content/api/server-loaders#resolveContentLink`) —
 * not from content_blocks.
 */
export const PrerequisiteCallout: React.FC<Props> = (props) => {
  if (props.links.length === 0) return null;

  return (
    <aside role="note" data-tone="prerequisite">
      <p>{props.heading}</p>
      <ul>
        {props.links.map((link) => (
          <li key={link.id}>
            <Link to={link.href}>{link.title} →</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};
