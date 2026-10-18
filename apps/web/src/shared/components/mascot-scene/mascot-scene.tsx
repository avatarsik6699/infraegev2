import { cssUtils } from "~/shared/lib/css-utils";
import type { MascotSceneTypes } from "./mascot-scene.types";
import styles from "./mascot-scene.module.css";

/** viewBox of each scene file, reserved as the image size. */
const sceneSizes: Record<
  MascotSceneTypes.Scene,
  { width: number; height: number }
> = {
  "home-hero": { width: 360, height: 300 },
  "sign-in": { width: 1074, height: 910 },
  register: { width: 906, height: 894 },
  "not-found": { width: 1200, height: 375 },
  error: { width: 1200, height: 375 },
  "empty-search": { width: 1260, height: 300 },
  paywall: { width: 1242, height: 1050 },
  "paywall-guest": { width: 1064, height: 656 },
  pricing: { width: 1320, height: 718 },
  "access-open": { width: 300, height: 254 },
};

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
    width={sceneSizes[props.scene].width}
    height={sceneSizes[props.scene].height}
    loading="lazy"
    decoding="async"
  />
);
