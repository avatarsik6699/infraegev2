import {
  analyticsBrowser,
  analyticsConsentStore,
} from "~/shared/lib/analytics";

export type ProductAnalyticsEvent =
  | { name: "lesson_opened"; properties: { lesson: string } }
  | {
      name: "theory_section_viewed";
      properties: { lesson: string; section: string };
    }
  | { name: "practice_started"; properties: { lesson: string } }
  | {
      name: "practice_answer_checked";
      properties: { lesson: string; result: "correct" | "incorrect" };
    }
  | { name: "lesson_completed"; properties: { lesson: string } }
  | {
      name: "continuation_opened";
      properties: { fromLesson: string; toLesson: string };
    };

const PROPERTY_VALUE = /^[a-z0-9-]{1,80}$/;

function hasSafeProperties(event: ProductAnalyticsEvent): boolean {
  return Object.values(event.properties).every(
    (value) =>
      value === "correct" ||
      value === "incorrect" ||
      PROPERTY_VALUE.test(value),
  );
}

export function reportProductEvent(event: ProductAnalyticsEvent): void {
  if (analyticsConsentStore.get() !== "granted" || !hasSafeProperties(event))
    return;
  analyticsBrowser.track(event.name, event.properties);
}
