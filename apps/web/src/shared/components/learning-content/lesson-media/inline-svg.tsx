import styles from "./lesson-media.module.css";

type Props = {
  /** Trusted markup from `site_media.py`, never user input. */
  svg: string;
  width: number;
  height: number;
  /** Accessible name; omitted for a frame whose meaning is in its caption. */
  label?: string;
  hidden?: boolean;
};

/**
 * Generated figure drawn inline, so its labels use the page font: an SVG in
 * `<img>` cannot load webfonts. The intrinsic ratio is reserved before paint.
 */
export const InlineSvg: React.FC<Props> = (props) => (
  <div
    className={styles.svg}
    style={{
      aspectRatio: `${String(props.width)} / ${String(props.height)}`,
      // never wider than drawn: a narrow figure stays centred (F11)
      maxWidth: `${String(props.width)}px`,
      // stops shrinking at 30rem, or at its drawn width when narrower
      minWidth: `min(30rem, ${String(props.width)}px)`,
    }}
    role={props.label ? "img" : undefined}
    aria-label={props.label}
    hidden={props.hidden}
    // Repository-generated markup (site_media.py), never user input.
    dangerouslySetInnerHTML={{ __html: props.svg }}
  />
);
