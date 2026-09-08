import { useEffect, useState, type RefObject } from "react";
import { elementActivity } from "./browser-adapter";

/** Attach to a stable mounted element; CSS owns reduced motion and playback cadence. */
export const useElementActivity = (ref: RefObject<HTMLElement | null>) => {
  const [active, setActive] = useState(false);
  useEffect(
    function observeElementActivityFx() {
      const element = ref.current;
      if (!element) return undefined;
      return elementActivity.observe(element, setActive);
    },
    [ref],
  );
  return active;
};
