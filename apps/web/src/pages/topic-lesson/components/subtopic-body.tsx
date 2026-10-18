import type { ResolvedSubtopic } from "~/entities/lesson";
import { Checkpoint, LessonTheory } from "~/shared/components/learning-content";
import { PaidPreview } from "~/features/paywall";
import { usePaidContent } from "~/shared/lib/paid-content";

type Props = {
  subtopic: ResolvedSubtopic;
  /** A paid subtopic the visitor cannot open: only its public preview. */
  locked: boolean;
  headingOrder: 2 | 3;
  theoryClassName?: string;
  sectionClassName?: string;
  sectionTitleClassName?: string;
};

/** The subtopic's theory and self-check; a paid subtopic reads them from its
 * paid module (Change 192), which the route loader has already loaded. */
export const SubtopicBody: React.FC<Props> = (props) => {
  const paid = usePaidContent(
    props.locked ? undefined : props.subtopic.paid?.load,
  );
  if (props.locked)
    return (
      <PaidPreview className={props.theoryClassName}>
        {props.subtopic.paid?.preview}
      </PaidPreview>
    );
  const checkpoint = paid ? paid.checkpoint : props.subtopic.checkpoint;
  return (
    <>
      <LessonTheory
        variant="page"
        concepts={paid?.theory ?? props.subtopic.concepts}
        conceptHeadingOrder={props.headingOrder}
        className={props.theoryClassName}
      />
      {checkpoint ? (
        // The subtopic's «объясни, почему» self-check, before its tasks:
        // reasoning first, then Excel or code (Change 184).
        <div id="self-check" className={props.sectionClassName}>
          <Checkpoint
            items={checkpoint}
            headingOrder={props.headingOrder}
            headingClassName={props.sectionTitleClassName}
          />
        </div>
      ) : null}
    </>
  );
};
