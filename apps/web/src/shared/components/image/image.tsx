import { cssUtils } from "~/shared/lib/css-utils";
import { ImageErrorState } from "./components/image-error-state";
import { ImageMedia } from "./components/image-media";
import { useImageStatus } from "./model/use-image-status";
import type { ImageTypes } from "./image.types";
import styles from "./image.module.css";

function inferAspectRatio(props: ImageTypes.Props): number | undefined {
  if (props.aspectRatio) return props.aspectRatio;
  if (typeof props.width !== "number" || typeof props.height !== "number") {
    return undefined;
  }
  return props.height === 0 ? undefined : props.width / props.height;
}

export const Image: React.FC<ImageTypes.Props> = (props) => {
  const imageStatus = useImageStatus({
    src: props.src,
    fallbackSrc: props.fallbackSrc,
  });
  const alt = props.decorative ? "" : props.alt;
  const decorative = Boolean(props.decorative);
  const aspectRatio = inferAspectRatio(props);

  return (
    <div
      className={cssUtils.cx(styles.root, props.className)}
      data-status={imageStatus.status}
      style={aspectRatio ? { aspectRatio: String(aspectRatio) } : undefined}
    >
      {imageStatus.status === "error" ? (
        <ImageErrorState alt={alt} decorative={decorative} />
      ) : (
        <ImageMedia
          imageStatus={imageStatus}
          alt={alt}
          decorative={decorative}
          width={props.width}
          height={props.height}
          fit={props.fit}
        />
      )}
    </div>
  );
};
