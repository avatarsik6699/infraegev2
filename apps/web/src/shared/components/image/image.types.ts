type BaseProps = {
  src: string;
  width?: number | string;
  height?: number | string;
  /** width/height ratio, e.g. 16 / 9 or naturalWidth / naturalHeight. Reserves
   * the loading skeleton's box so nothing jumps once the image resolves.
   * Inferred automatically when both `width` and `height` are numbers; omit
   * all three and the skeleton falls back to a fixed min-height instead,
   * which can still shift once the real image resolves to a different
   * height — supply real dimensions (or `aspectRatio`) whenever they're
   * known ahead of time. */
  aspectRatio?: number;
  fallbackSrc?: string;
  fit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  className?: string;
};

type InformativeProps = {
  alt: string;
  decorative?: false;
};

type DecorativeProps = {
  decorative: true;
  alt?: never;
};

export namespace ImageTypes {
  export type Props = BaseProps & (InformativeProps | DecorativeProps);

  export type Status = "loading" | "loaded" | "error";

  export type UseImageStatusResult = {
    status: Status;
    currentSrc: string;
    handleLoad: () => void;
    handleError: () => void;
  };
}
