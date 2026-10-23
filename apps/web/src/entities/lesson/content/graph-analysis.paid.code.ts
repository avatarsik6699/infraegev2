// Paid content (Change 192): the programs of topic 23, shared by its paid
// subtopics; never import it from public code.

/** Reading the file into the dictionary graph, as every program of the topic does. */
export const READ_GRAPH =
  'graph = {}\nfor line in open("23.txt"):\n    a, b, w = line.split()\n    a, b, w = int(a), int(b), float(w)\n    if a not in graph:\n        graph[a] = []\n    graph[a].append((b, w))';

/** The function of the topic: the cost of the best path from v to 100. */
export const F_CODE =
  '@cache\ndef f(v):\n    if v == 100:\n        return 0\n    best = float("inf")\n    for u, w in graph.get(v, []):\n        best = min(best, w + f(u))\n    return best';
