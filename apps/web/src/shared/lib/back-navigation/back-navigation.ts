import type { BackNavigationTypes } from "./back-navigation.types";

export const backNavigation = {
  shouldUseHistory(intent: BackNavigationTypes.ClickIntent): boolean {
    const modifiedClick =
      intent.metaKey || intent.altKey || intent.ctrlKey || intent.shiftKey;

    return intent.button === 0 && !modifiedClick && intent.canGoBack;
  },
};
