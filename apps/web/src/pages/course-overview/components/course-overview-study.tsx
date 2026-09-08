import { useRef } from "react";
import { Image } from "~/shared/components/image";
import { useCourseOverviewMotion } from "../model/use-course-overview-motion";
import styles from "../course-overview-page.module.css";

type Props = { kind: "sequence" | "branch" | "stack" };

export const CourseOverviewStudy: React.FC<Props> = (props) => {
  const studyRef = useRef<HTMLDivElement>(null);
  const active = useCourseOverviewMotion(studyRef);
  return (
    <div
      ref={studyRef}
      data-course-study={props.kind}
      className={styles.atmosphereStudy}
      data-motion-active={active || undefined}
    >
      <Image
        src={`/images/course-overview/${props.kind}.webp`}
        width={1536}
        height={1024}
        decorative
        fit="contain"
        className={styles.studyImage}
      />
      <span className={styles.studySheen} aria-hidden="true" />
    </div>
  );
};
