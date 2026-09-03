import { Fragment } from "react";
import { Notation } from "~/shared/components/notation";

type PracticeInlineTextProps = {
  text: string;
};

export const PracticeInlineText: React.FC<PracticeInlineTextProps> = (
  props,
) => (
  <>
    {props.text.split(/(`[^`]+`)/g).map((fragment, index) => {
      const isCode = fragment.startsWith("`") && fragment.endsWith("`");
      return (
        <Fragment key={`${index}-${fragment}`}>
          {isCode ? <Notation>{fragment.slice(1, -1)}</Notation> : fragment}
        </Fragment>
      );
    })}
  </>
);
