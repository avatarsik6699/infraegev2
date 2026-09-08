import { cssUtils } from "~/shared/lib/css-utils";
import type { SurfaceDecorationTypes } from "./surface-decoration.types";
import styles from "./surface-decoration.module.css";

export const SurfaceGlint: React.FC<SurfaceDecorationTypes.GlintProps> = ({
  kind,
  active,
  playback = "once",
  className,
  ...spanProps
}) => (
  <span
    {...spanProps}
    aria-hidden="true"
    className={cssUtils.cx(styles.glint, styles[kind], className)}
    data-surface-glint={kind}
    data-glint-active={active || undefined}
    data-playback={playback}
  />
);
