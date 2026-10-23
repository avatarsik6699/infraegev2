/** A typical mistake on the switcher of «Практика и итог» (T254), as in the
 * course summary: the wrong step, the right one, the question that catches it. */
export const FinalMistake: React.FC<{
  wrong: React.ReactNode;
  right: React.ReactNode;
  question: React.ReactNode;
}> = (props) => (
  <>
    {props.wrong} → {props.right}. Спроси себя: {props.question}
  </>
);
