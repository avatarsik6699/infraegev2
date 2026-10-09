import type { LessonMediaTypes } from "../lesson-media/lesson-media.types";

type Vertex = LessonMediaTypes.GraphNode["id"];
type Graph = Pick<
  LessonMediaTypes.Graph,
  "edges" | "source" | "target" | "shortest"
>;

export type PathState = {
  path: readonly Vertex[];
  /** Why the last attempt changed nothing or what the learner reached. */
  note: string;
};

/** The weight of the edge u → v, or null when the graph has no such arrow. */
export function weightOf(
  graph: Graph,
  from: Vertex,
  to: Vertex,
): string | null {
  return (
    graph.edges.find((e) => e.from === from && e.to === to)?.weight ?? null
  );
}

/**
 * Exact sum of decimal weights written as text: every weight is scaled to
 * the same number of fraction digits, so 0.1 + 0.2 is 0.3, not 0.30000000000000004.
 */
export function decimalSum(weights: readonly string[]): string {
  const digits = Math.max(
    0,
    ...weights.map((w) => w.split(".")[1]?.length ?? 0),
  );
  const scale = 10 ** digits;
  const total = weights.reduce(
    (sum, w) => sum + Math.round(Number(w) * scale),
    0,
  );
  if (digits === 0) return String(total);
  const text = (total / scale).toFixed(digits);
  return text.replace(/\.?0+$/, "");
}

export function pathWeights(graph: Graph, path: readonly Vertex[]): string[] {
  return path.slice(1).map((v, i) => weightOf(graph, path[i], v) ?? "0");
}

export function startState(graph: Graph): PathState {
  return {
    path: [graph.source],
    note: `Начинаем в вершине ${String(graph.source)}: выберите, куда идти`,
  };
}

/** One click on a vertex: extend the path along an arrow or explain why not. */
export function step(
  graph: Graph,
  state: PathState,
  vertex: Vertex,
): PathState {
  const last = state.path[state.path.length - 1];
  if (last === graph.target) {
    return {
      ...state,
      note: "Цель уже достигнута — нажмите «Сначала» или «Шаг назад»",
    };
  }
  if (vertex === last) return state;
  if (weightOf(graph, last, vertex) === null) {
    const back = weightOf(graph, vertex, last) !== null;
    return {
      ...state,
      note: back
        ? `Из ${String(last)} в ${String(vertex)} ребра нет: стрелка идёт только ${String(vertex)} → ${String(last)}`
        : `Из ${String(last)} в ${String(vertex)} ребра нет`,
    };
  }
  const path = [...state.path, vertex];
  if (vertex === graph.target) {
    const shortest =
      decimalSum(pathWeights(graph, path)) === decimalSum([graph.shortest]);
    return {
      path,
      note: shortest
        ? "Дошли до цели. Это кратчайший путь"
        : "Дошли до цели. Есть путь короче — попробуйте найти его",
    };
  }
  if (!graph.edges.some((e) => e.from === vertex)) {
    return {
      path,
      note: `Из ${String(vertex)} рёбер нет: это тупик, до цели отсюда не дойти`,
    };
  }
  return { path, note: "Выберите следующую вершину" };
}

export function back(graph: Graph, state: PathState): PathState {
  if (state.path.length <= 1) return startState(graph);
  const path = state.path.slice(0, -1);
  return path.length > 1 ? { path, note: "" } : startState(graph);
}

/** «Путь: 1 → 40 → 7 · длина 2 + 1 = 3. Выберите следующую вершину». */
export function statusText(graph: Graph, state: PathState): string {
  const weights = pathWeights(graph, state.path);
  let head = `Путь: ${state.path.map(String).join(" → ")}`;
  if (weights.length) {
    const sum = decimalSum(weights);
    head += ` · длина ${weights.length > 1 ? `${weights.join(" + ")} = ` : ""}${sum}`;
  }
  return state.note ? `${head}. ${state.note}` : head;
}
