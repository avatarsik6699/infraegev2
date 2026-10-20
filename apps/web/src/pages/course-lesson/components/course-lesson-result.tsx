import type { CourseTypes } from "~/entities/course";
import { Checkpoint } from "~/shared/components/learning-content";
import { Typography } from "~/shared/components/typography";
import { usePaidContent } from "~/shared/lib/paid-content";
import layout from "~/shared/styles/lesson-layout.module.css";

type Props = {
  lesson: CourseTypes.LessonDefinition;
  /** A paid lesson the visitor cannot open (Change 192). */
  locked: boolean;
  sectionClassName: string;
  titleClassName: string;
};

/**
 * «Итог» and «Проверьте себя» as two sections right after the theory, before
 * «Практика» (Change 197). A paid lesson reads both from its paid module
 * (Change 192); a locked one shows neither.
 */
export const CourseLessonResult: React.FC<Props> = (props) => {
  const paid = usePaidContent(
    props.locked ? undefined : props.lesson.paid?.load,
  );
  if (props.locked) return null;
  const content = paid ?? props.lesson;
  return (
    <>
      <section
        id="result"
        className={props.sectionClassName}
        aria-labelledby="result-title"
      >
        <Typography.Title
          order={2}
          id="result-title"
          className={props.titleClassName}
        >
          Итог
        </Typography.Title>
        <div className={layout.resultGrid}>
          <div className={layout.resultSummary}>
            <Typography.Prose>{content.result}</Typography.Prose>
          </div>
        </div>
      </section>
      {content.checkpoint ? (
        <div id="self-check" className={props.sectionClassName}>
          <Checkpoint
            items={content.checkpoint}
            headingClassName={props.titleClassName}
          />
        </div>
      ) : null}
    </>
  );
};
