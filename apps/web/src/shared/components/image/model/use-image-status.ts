import { useState } from "react";
import type { ImageTypes } from "../image.types";

type UseImageStatusArgs = {
  src: string;
  fallbackSrc?: string;
};

/** Owns the loading/loaded/error state machine and the src → fallbackSrc swap for `Image`. */
export function useImageStatus(
  args: UseImageStatusArgs,
): ImageTypes.UseImageStatusResult {
  const [status, setStatus] = useState<ImageTypes.Status>("loading");
  const [currentSrc, setCurrentSrc] = useState(args.src);
  const [triedFallback, setTriedFallback] = useState(false);
  // Adjust state during render rather than in an effect when `src` changes
  // out from under us (react.dev/learn/you-might-not-need-an-effect).
  const [trackedSrc, setTrackedSrc] = useState(args.src);
  if (trackedSrc !== args.src) {
    setTrackedSrc(args.src);
    setCurrentSrc(args.src);
    setTriedFallback(false);
    setStatus("loading");
  }

  const handleLoad = () => {
    setStatus("loaded");
  };

  const handleError = () => {
    if (args.fallbackSrc && !triedFallback) {
      setTriedFallback(true);
      setCurrentSrc(args.fallbackSrc);
      setStatus("loading");
      return;
    }
    setStatus("error");
  };

  return { status, currentSrc, handleLoad, handleError };
}
