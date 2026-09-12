import { SurfaceGlint } from "~/shared/components/surface-decoration";
import { useRef, useState } from "react";
import { Image, type ImageTypes } from "~/shared/components/image";
import { useElementActivity } from "~/shared/lib/element-activity";
import styles from "../course-overview-page.module.css";

type Props = { kind: "sequence" | "branch" | "stack" };

export const CourseOverviewStudy: React.FC<Props> = (props) => {
  const studyRef = useRef<HTMLDivElement>(null);
  const [imageStatus, setImageStatus] = useState<ImageTypes.Status>("loading");
  const visible = useElementActivity(studyRef);
  const active = visible && imageStatus === "loaded";
  return (
    <div
      ref={studyRef}
      data-course-study={props.kind}
      className={styles.atmosphereStudy}
      data-motion-active={active || undefined}
    >
      <Image
        onStatusChange={setImageStatus}
        src={`/images/course-overview/${props.kind}.webp`}
        srcSet={[480, 960, 1536]
          .map(
            (width) =>
              `/images/course-overview/responsive/${props.kind}-${String(width)}.webp ${String(width)}w`,
          )
          .join(", ")}
        sizes="54vw"
        fetchPriority="low"
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
