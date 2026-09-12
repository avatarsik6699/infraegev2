import { SurfaceGlint } from "~/shared/components/surface-decoration";
import { useRef, useState } from "react";
import { useElementActivity } from "~/shared/lib/element-activity";
import { CourseOverviewField } from "./course-overview-field";
import { Image, type ImageTypes } from "~/shared/components/image";
import styles from "../course-overview-page.module.css";

type Props = { courseId: string };

export const CourseOverviewArtwork: React.FC<Props> = (props) => {
  const artworkRef = useRef<HTMLDivElement>(null);
  const [imageStatus, setImageStatus] = useState<ImageTypes.Status>("loading");
  const visible = useElementActivity(artworkRef);
  const active = visible && imageStatus === "loaded";
  if (props.courseId !== "python") return null;

  return (
    <div
      ref={artworkRef}
      className={styles.artwork}
      aria-hidden="true"
      data-course-artwork
      data-motion-active={active || undefined}
    >
      <CourseOverviewField active={active} />
      <SurfaceGlint
        kind="soft"
        active={active}
        playback="loop"
        className={styles.artworkSheen}
        data-course-sheen
      />
      <Image
        onStatusChange={setImageStatus}
        src="/images/course-catalog/python.webp"
        srcSet="/images/course-catalog/responsive/python-480.webp 480w, /images/course-catalog/responsive/python-960.webp 960w, /images/course-catalog/responsive/python-1536.webp 1536w"
        sizes="(max-width: 40rem) 85vw, (max-width: 58rem) 35vw, 32rem"
        loading="eager"
        fetchPriority="high"
        width={1536}
        height={1024}
        decorative
        fit="contain"
        className={styles.artworkImage}
      />
    </div>
  );
};
