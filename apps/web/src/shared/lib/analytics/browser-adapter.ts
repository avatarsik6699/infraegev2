import { clientEnv } from "~/shared/config/client-env";

type UmamiWindow = Window & {
  umami?: {
    track: (
      name: string,
      data?: Record<string, string | number | boolean>,
    ) => void;
  };
};
const SCRIPT_ID = "infraege-optional-analytics";
function currentWindow(): UmamiWindow | null {
  return typeof window === "undefined" ? null : window;
}
function enable(websiteId = clientEnv.umamiWebsiteId): void {
  const ownerDocument = typeof document === "undefined" ? null : document;
  if (!ownerDocument || !websiteId || ownerDocument.getElementById(SCRIPT_ID))
    return;
  const script = ownerDocument.createElement("script");
  script.id = SCRIPT_ID;
  script.defer = true;
  script.src = "/stats/script.js";
  script.dataset.websiteId = websiteId;
  script.dataset.domains = "infraege.ru";
  script.dataset.doNotTrack = "true";
  script.dataset.excludeSearch = "true";
  script.dataset.excludeHash = "true";
  ownerDocument.head.append(script);
}
function withdraw(): void {
  if (typeof document !== "undefined")
    document.getElementById(SCRIPT_ID)?.remove();
  const ownerWindow = currentWindow();
  if (ownerWindow) ownerWindow.location.reload();
}
function track(
  name: string,
  data?: Record<string, string | number | boolean>,
): void {
  currentWindow()?.umami?.track(name, data);
}
export const analyticsBrowser = { enable, withdraw, track };
