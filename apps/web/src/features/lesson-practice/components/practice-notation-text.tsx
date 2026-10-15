import { Fragment } from "react";
import { practiceTaskNotation } from "~/entities/practice-task";

type PracticeNotationTextProps = {
  text: string;
};

/** Statement text with the bank's TeX scripts read as sup/sub (F7). */
export const PracticeNotationText: React.FC<PracticeNotationTextProps> = (
  props,
) =>
  practiceTaskNotation.has(props.text) ? (
    <>
      {practiceTaskNotation.segments(props.text).map((segment, index) => {
        const key = `${String(index)}-${segment.text}`;
        if (segment.kind === "text")
          return <Fragment key={key}>{segment.text}</Fragment>;
        const Script = segment.kind;
        return <Script key={key}>{segment.text}</Script>;
      })}
    </>
  ) : (
    props.text
  );
