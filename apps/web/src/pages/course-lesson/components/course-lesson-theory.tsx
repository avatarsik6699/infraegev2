import type { CourseTypes } from "~/entities/course";
import { LessonTheory } from "~/shared/components/learning-content";
import { PaidPreview } from "~/features/paywall";
import { usePaidContent } from "~/shared/lib/paid-content";

type Props = {
  lesson: CourseTypes.LessonDefinition;
  /** A paid lesson the visitor cannot open (Change 192). */
  locked: boolean;
};

/** A paid lesson reads its theory from its paid module (Change 192). */
export const CourseLessonTheory: React.FC<Props> = (props) => {
  const paid = usePaidContent(
    props.locked ? undefined : props.lesson.paid?.load,
  );
  if (props.locked)
    return <PaidPreview>{props.lesson.paid?.preview}</PaidPreview>;
  return (
    <LessonTheory
      variant="page"
      concepts={paid?.theory ?? props.lesson.theory ?? []}
      conceptHeadingOrder={2}
    />
  );
};
