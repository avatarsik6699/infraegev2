import { useEffect, useMemo, useState } from "react";
import { topicCatalog } from "~/entities/topic-catalog";
import {
  useLessonProgressHydrated,
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

  const ready = hydrated && loadState === "ready";
  const aggregate = topicCatalogModel.aggregate(ready ? lessons : [], progress);
  const incomplete = ready && publishedIds.some((id) => !aggregate.byId[id]);
  return {
    totalTopics: topicCatalog.entries.length,
    publishedTopics: publishedIds.length,
    query,
    setQuery,
    filter,
    setFilter,
    byId: aggregate.byId,
    ready,
    loadState:
      loadState === "ready" && !hydrated ? ("loading" as const) : loadState,
    totalSolved: ready && !incomplete ? aggregate.totalSolved : null,
    unavailable: loadState === "error" || incomplete,
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
