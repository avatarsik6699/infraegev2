import { SurfaceGlint } from "~/shared/components/surface-decoration";
import { useRef } from "react";
import { Image } from "~/shared/components/image";
import { useElementActivity } from "~/shared/lib/element-activity";
import styles from "../course-overview-page.module.css";

type Props = { kind: "sequence" | "branch" | "stack" };

export const CourseOverviewStudy: React.FC<Props> = (props) => {
  const studyRef = useRef<HTMLDivElement>(null);
  const active = useElementActivity(studyRef);
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
      <SurfaceGlint
        kind="soft"
        active={active}
        playback="loop"
        className={styles.studySheen}
      />
    </div>
  );
};
