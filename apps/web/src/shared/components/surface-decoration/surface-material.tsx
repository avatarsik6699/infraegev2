import { cssUtils } from "~/shared/lib/css-utils";
import type { SurfaceDecorationTypes } from "./surface-decoration.types";
import styles from "./surface-decoration.module.css";

export const SurfaceMaterial: React.FC<SurfaceDecorationTypes.MaterialProps> = (
  props,
) => (
  <span
    aria-hidden="true"
    className={cssUtils.cx(styles.material, props.className)}
    data-surface-material
  >
    {props.children}
  </span>
);
