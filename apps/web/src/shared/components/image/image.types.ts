type BaseProps = {
  src: string;
  width?: number | string;
  height?: number | string;
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
}
