import { examPlan, type TopicCatalogTypes } from "~/entities/topic-catalog";
import { safeLs } from "~/shared/lib/safe-ls";
import { useExternalStoreValue } from "~/shared/lib/use-external-store-value";

/**
 * Change 185 (F35): the visitor's goal on `/ege`, kept on this device. The
 * prerendered page shows Хард (every task), so a stored goal only dims rows.
 */
const goalStore = safeLs.createStore<TopicCatalogTypes.Goal>({
  key: "infraege:ege-goal",
  version: 1,
  guard: examPlan.isGoal,
});

export const useTopicGoal = () => {
  const stored = useExternalStoreValue(goalStore);
  return {
    goal: stored ?? examPlan.defaultGoal,
    setGoal: goalStore.set,
  };
};
