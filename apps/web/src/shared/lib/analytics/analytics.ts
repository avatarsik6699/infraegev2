type AnalyticsEvent =
  | { name: "topic_view"; data: { topic_id: string } }
  | {
      name: "practice_start";
      data: { topic_id: string; total_tasks: number };
    }
  | {
      name: "practice_answer";
      data: {
        topic_id: string;
        task_index: number;
        result: "correct" | "wrong";
      };
    };

type AnalyticsWindow = Window & {
  umami?: {
    track: (name: string, data: Record<string, string | number>) => void;
  };
};

const startedTopics = new Set<string>();

function trackingAllowed(): boolean {
  if (typeof window === "undefined") return false;
  const dnt = navigator.doNotTrack?.toLowerCase();
  return (
    dnt !== "1" &&
    dnt !== "yes" &&
    typeof (window as AnalyticsWindow).umami?.track === "function"
  );
}

function track(event: AnalyticsEvent): void {
  if (!trackingAllowed()) return;
  (window as AnalyticsWindow).umami?.track(event.name, event.data);
}

export function trackTopicView(topicId: string): void {
  track({ name: "topic_view", data: { topic_id: topicId } });
}

export function trackPracticeStart(topicId: string, totalTasks: number): void {
  if (startedTopics.has(topicId)) return;
  startedTopics.add(topicId);
  track({
    name: "practice_start",
    data: { topic_id: topicId, total_tasks: totalTasks },
  });
}

export function trackPracticeAnswer(
  topicId: string,
  taskIndex: number,
  correct: boolean,
): void {
  track({
    name: "practice_answer",
    data: {
      topic_id: topicId,
      task_index: taskIndex,
      result: correct ? "correct" : "wrong",
    },
  });
}
