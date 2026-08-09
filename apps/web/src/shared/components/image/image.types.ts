type BaseProps = {
  src: string;
  width?: number | string;
  height?: number | string;
  fallbackSrc?: string;
  fit?: React.CSSProperties["objectFit"];
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
