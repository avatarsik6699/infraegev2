import { Link } from "@tanstack/react-router";
import type { Topic } from "~/entities/content/model/types";

export function HomePage({ topics }: { topics: Topic[] }) {
  return (
    <main className="container">
      <h1>Подготовка к ЕГЭ по информатике</h1>
      {/* No full-site search on M0 — plain navigation by task number is enough while there are
          fewer than ten topics (docs/SPEC.md §10). */}
      <ul>
        {topics.map((topic) => (
          <li key={topic.id}>
            <Link
              to="/theory/$topicSlug"
              params={{
                topicSlug: `zadanie-${topic.task_numbers[0]}-${topic.id}`,
              }}
            >
              <span className="task-badge">№{topic.task_numbers[0]}</span>{" "}
              {topic.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
