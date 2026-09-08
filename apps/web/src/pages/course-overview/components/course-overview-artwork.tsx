import { SurfaceGlint } from "~/shared/components/surface-decoration";
import { useRef } from "react";
import { useElementActivity } from "~/shared/lib/element-activity";
import { CourseOverviewField } from "./course-overview-field";
import { Image } from "~/shared/components/image";
import styles from "../course-overview-page.module.css";

type Props = { courseId: string };

export const CourseOverviewArtwork: React.FC<Props> = (props) => {
  const artworkRef = useRef<HTMLDivElement>(null);
  const active = useElementActivity(artworkRef);
  if (props.courseId !== "python") return null;

  return (
    <div
      ref={artworkRef}
      className={styles.artwork}
      aria-hidden="true"
      data-course-artwork
      data-motion-active={active || undefined}
    >
      <CourseOverviewField />
      <SurfaceGlint
        kind="soft"
        active={active}
        playback="loop"
        className={styles.artworkSheen}
        data-course-sheen
      />
      <Image
        src="/images/course-catalog/python.webp"
        width={1536}
        height={1024}
        decorative
        fit="contain"
        className={styles.artworkImage}
      />
    </div>
  );
};
