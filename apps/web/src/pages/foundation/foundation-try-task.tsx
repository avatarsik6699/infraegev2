import { useState } from "react";
import { getPracticeTask, PracticeTask } from "~/widgets/practice-task";
import type { FoundationPageTypes } from "./foundation-page.types";

export const FoundationTryTask: React.FC<FoundationPageTypes.Props> = (
  props,
) => {
  const [refreshed, setRefreshed] = useState<
    FoundationPageTypes.Props["featuredTask"] | null
  >(null);
  const result = refreshed ?? props.featuredTask;
  const detail = result.detail;
  if (!detail) return null;
  const refresh = async () => {
    const next = await getPracticeTask({ data: detail.task.id });
    if (!next.detail) throw new Error("Practice refresh unavailable");
    setRefreshed(next);
  };
  return (
    <PracticeTask
      key={detail.task.id}
      task={detail.task}
      links={result.links}
      onRefresh={refresh}
      presentation="embed"
    />
  );
};
