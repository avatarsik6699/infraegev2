import { useEffect, useState } from "react";

/**
 * Показывает, видна ли хотя бы доля `threshold` элемента. Без IntersectionObserver
 * (старые браузеры, тесты) считает элемент видимым, чтобы содержимое не пропадало.
 */
export function useInViewport(
  ref: React.RefObject<Element | null>,
  threshold = 0.5,
): boolean {
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(
    function observeViewportFx() {
      const element = ref.current;
      if (!element || typeof IntersectionObserver === "undefined") return;
      const observer = new IntersectionObserver(
        (entries) => {
          const last = entries.at(-1);
          if (last) setVisible(last.isIntersecting);
        },
        { threshold },
      );
      observer.observe(element);
      return () => observer.disconnect();
    },
    [ref, threshold],
  );

  return visible;
}
