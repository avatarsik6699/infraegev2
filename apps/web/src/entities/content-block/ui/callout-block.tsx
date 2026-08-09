import type { CalloutBlockData } from "~/entities/content/model/types";

/** Author-written aside inside content_blocks (info/warning). For the auto-derived
 * prerequisite/related-topic navigation widget, see `~/entities/content/ui/prerequisite-callout`. */
export function CalloutBlock({ data }: { data: CalloutBlockData }) {
  return (
    <aside role="note" data-tone={data.tone}>
      <p>{data.markdown}</p>
    </aside>
  );
}
