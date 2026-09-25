import { useEffect, useMemo, useState } from "react";
import { topicCatalog } from "~/entities/topic-catalog";
import {
  useLessonProgressHydrated,
  useLessonProgressStatus,
  useLessonsProgress,
} from "~/features/lesson-progress";
import { getTopicPracticeSummary } from "../api/get-topic-practice-summary";
import type { TopicCatalogPageTypes } from "../topic-catalog-page.types";
import { topicCatalogModel } from "./topic-catalog-model";

const publishedIds = topicCatalog.entries
  .filter((entry) => entry.status === "published")
  .map((entry) => entry.id);

export const useTopicCatalog = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<TopicCatalogPageTypes.Filter>("all");
  const [summary, setSummary] = useState<TopicCatalogPageTypes.Summary>([]);
  const [loadState, setLoadState] =
    useState<TopicCatalogPageTypes.LoadState>("loading");
  const [attempt, setAttempt] = useState(0);
  const hydrated = useLessonProgressHydrated();
  const progressStatus = useLessonProgressStatus();
  const lessons = useMemo(
    () => summary.filter((topic) => publishedIds.includes(topic.id)),
    [summary],
  );
  const progress = useLessonsProgress(publishedIds, lessons);

  useEffect(
    function loadTopicSummaryFx() {
      const controller = new AbortController();
      void getTopicPracticeSummary(controller.signal)
        .then((result) => {
          if (controller.signal.aborted) return;
          setSummary(result);
          setLoadState("ready");
        })
        .catch(() => {
          if (!controller.signal.aborted) setLoadState("error");
        });
      return () => controller.abort();
    },
    [attempt],
  );

  const hasVisualProgress =
    loadState === "ready" && (hydrated || progressStatus === "guest");
  const ready = hydrated && loadState === "ready";
  const aggregate = topicCatalogModel.aggregate(
    hasVisualProgress ? lessons : [],
    progress,
  );
  const incomplete =
    hasVisualProgress && publishedIds.some((id) => !aggregate.byId[id]);
  let effectiveLoadState: TopicCatalogPageTypes.LoadState = loadState;
  if (progressStatus === "error") effectiveLoadState = "error";
  else if (loadState === "ready" && !hydrated && progressStatus !== "guest")
    effectiveLoadState = "loading";
  return {
    totalTopics: topicCatalog.entries.length,
    publishedTopics: publishedIds.length,
    query,
    setQuery,
    filter,
    setFilter,
    byId: aggregate.byId,
    ready,
    loadState: effectiveLoadState,
    totalSolved:
      hasVisualProgress && !incomplete ? aggregate.totalSolved : null,
    unavailable:
      loadState === "error" || progressStatus === "error" || incomplete,
    entries: topicCatalog.entries.filter((entry) =>
      topicCatalogModel.matches(entry, query, filter, aggregate.byId[entry.id]),
    ),
    retry: () => {
      setLoadState("loading");
      setAttempt((value) => value + 1);
    },
    reset: () => {
      setQuery("");
      setFilter("all");
    },
  };
};
