import { Image as MantineImage } from "@mantine/core";
import type { ImageTypes } from "./image.types";

export const Image: React.FC<ImageTypes.Props> = (props) => {
  return (
    <MantineImage
      src={props.src}
      alt={props.decorative ? "" : props.alt}
      role={props.decorative ? "presentation" : undefined}
      aria-hidden={props.decorative || undefined}
      loading="lazy"
      decoding="async"
      width={props.width}
      height={props.height}
      fallbackSrc={props.fallbackSrc}
      fit={props.fit}
      className={props.className}
    />
  );
};
