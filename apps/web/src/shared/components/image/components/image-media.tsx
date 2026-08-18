import { useEffect, useRef } from "react";
import type { ImageTypes } from "../image.types";
import styles from "../image.module.css";

type ImageMediaProps = {
  imageStatus: ImageTypes.UseImageStatusResult;
  alt: string;
  decorative: boolean;
  width?: number | string;
  height?: number | string;
  fit?: "contain" | "cover" | "fill" | "none" | "scale-down";
};

export const ImageMedia: React.FC<ImageMediaProps> = (props) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const currentSrc = props.imageStatus.currentSrc;
  const handleLoad = props.imageStatus.handleLoad;

  useEffect(
    function syncCachedImageStatusFx() {
      // A cached image can already be complete before `onLoad` ever fires for
      // this src (including a cached fallback) — check once per src.
      if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
        handleLoad();
      }
    },
    [currentSrc, handleLoad],
  );

  return (
    <>
      <img
        ref={imgRef}
        src={props.imageStatus.currentSrc}
        alt={props.alt}
        role={props.decorative ? "presentation" : undefined}
        aria-hidden={props.decorative || undefined}
        loading="lazy"
        decoding="async"
        width={props.width}
        height={props.height}
        style={props.fit ? { objectFit: props.fit } : undefined}
        onLoad={props.imageStatus.handleLoad}
        onError={props.imageStatus.handleError}
        className={styles.image}
      />
      {props.imageStatus.status === "loading" ? (
        <span className={styles.skeleton} aria-hidden="true" />
      ) : null}
    </>
  );
};
