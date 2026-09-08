import { useEffect, useState, type RefObject } from "react";
import { elementActivity } from "~/shared/lib/element-activity";

export const useCourseOverviewMotion = (ref: RefObject<HTMLElement | null>) => {
  const [active, setActive] = useState(false);
  useEffect(
    function observeOverviewMotionFx() {
      const element = ref.current;
      if (!element) return undefined;
      return elementActivity.observe(element, setActive);
    },
    [ref],
  );
  return active;
};
