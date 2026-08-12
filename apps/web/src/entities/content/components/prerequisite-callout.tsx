import { Alert, List, Stack } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import type { ResolvedContentLink } from "../lib/content-link";
import { Typography } from "~/shared/components/typography";

type Props = {
  heading: string;
  links: ResolvedContentLink[];
};

/**
 * "Эта тема легче даётся, если понимать [Python: списки] → перейти" (docs/SPEC.md §5.2).
 * Rendered from a Topic's `prerequisites`/`related_topics`/`unlocks_topics`, already resolved to
 * routes by the page's loader (see `../api/server-loaders#resolveContentLink`) —
 * not from authored section blocks.
 */
export const PrerequisiteCallout: React.FC<Props> = (props) => {
  if (props.links.length === 0) return null;

  return (
    <Alert
      role="note"
      data-tone="prerequisite"
      color="textbook"
      variant="light"
    >
      <Stack gap="xs">
        <Typography.Text>{props.heading}</Typography.Text>
        <List>
          {props.links.map((link) => (
            <List.Item key={link.id}>
              <Link to={link.href}>{link.title} →</Link>
            </List.Item>
          ))}
        </List>
      </Stack>
    </Alert>
  );
};
