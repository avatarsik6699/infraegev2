import { useCallback, useEffect, useRef, useState } from "react";
import {
  getPracticeTask,
  type PracticeTaskWidgetTypes,
} from "~/widgets/practice-task";

export function useInlineTask(id: string, active: boolean) {
  const [result, setResult] = useState<PracticeTaskWidgetTypes.Result | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const alive = useRef(true);
  const pending = useRef<Promise<PracticeTaskWidgetTypes.Result> | null>(null);
  useEffect(function trackLifetimeFx() {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const load = useCallback(() => {
    if (pending.current) return pending.current;
    setLoading(true);
    const request = getPracticeTask({ data: id })
      .catch((): PracticeTaskWidgetTypes.Result => ({
        status: "unavailable" as const,
        detail: null,
        links: [],
      }))
      .then((next) => {
        if (alive.current) {
          setResult((current) =>
            next.status === "unavailable" && current?.detail ? current : next,
          );
          setLoading(false);
        }
        pending.current = null;
        return next;
      });
    pending.current = request;
    return request;
  }, [id]);
  useEffect(
    function loadExpandedTaskFx() {
      if (active && !result) void load();
    },
    [active, result, load],
  );
  return {
    result,
    loading,
    load,
    refresh: async () => {
      const next = await load();
      if (!next.detail) throw new Error("Practice refresh unavailable");
    },
  };
}
