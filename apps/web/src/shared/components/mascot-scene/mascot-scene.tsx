import { cssUtils } from "~/shared/lib/css-utils";
import type { MascotSceneTypes } from "./mascot-scene.types";
import styles from "./mascot-scene.module.css";

/** Every scene shares the 6:5 viewBox of the pipeline. */
const sceneSize = { width: 360, height: 300 } as const;

/**
 * Decorative mascot scene (DESIGN.md › Illustrations). A separate SVG file
 * with its own CSS motion: it stays out of the HTML and the JS bundle, and a
 * lazy image inside a hidden slot is never fetched.
 */
export const MascotScene: React.FC<MascotSceneTypes.Props> = (props) => (
  <img
    className={cssUtils.cx(styles.root, props.className)}
    data-mascot-scene={props.scene}
    src={`/images/mascot/${props.scene}.svg`}
    alt=""
    width={sceneSize.width}
    height={sceneSize.height}
    loading="lazy"
    decoding="async"
  />
);
