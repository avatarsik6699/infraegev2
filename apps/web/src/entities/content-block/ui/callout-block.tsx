import type { CalloutBlockData } from "~/entities/content/model/types";

type Props = { data: CalloutBlockData };

/** Author-written aside inside content_blocks (info/warning). For the auto-derived
 * prerequisite/related-topic navigation widget, see `~/entities/content/ui/prerequisite-callout`. */
export const CalloutBlock: React.FC<Props> = (props) => {
  return (
    <aside role="note" data-tone={props.data.tone}>
      <p>{props.data.markdown}</p>
    </aside>
  );
};
