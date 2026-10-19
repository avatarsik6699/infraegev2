import {
  practiceCatalog,
  practiceTaskStatement,
} from "~/entities/practice-task";
import { createFileRoute } from "@tanstack/react-router";
import { PracticeTaskPage, getPracticeTask } from "~/pages/practice-task";
import { pageHead } from "~/shared/lib/seo";
export const Route = createFileRoute("/practice/$taskId")({
  validateSearch: practiceCatalog.taskSearch,
  loader: ({ params }) => getPracticeTask({ data: params.taskId }),
  staleTime: 0,
  // Change 194: thousands of tasks share a few topic titles, so the statement
  // makes each title and description its own.
  head: ({ loaderData, params }) => {
    const task = loaderData?.detail?.task;
    const lead = task ? practiceTaskStatement.excerpt(task.statement, 45) : "";
    return pageHead.create({
      title: task
        ? `${lead ? `${task.title}: ${lead}` : task.title} — Кодумка`
        : "Задача недоступна — Кодумка",
      description:
        (task && practiceTaskStatement.excerpt(task.statement, 160)) ||
        loaderData?.detail?.answerInstruction ||
        "Самостоятельная практика по информатике.",
      path: `/practice/${params.taskId}`,
      type: "article",
      noIndex: !loaderData?.detail?.catalogVisible,
    });
  },
  component: PracticeTaskRoute,
});
function PracticeTaskRoute() {
  return (
    <PracticeTaskPage
      key={Route.useParams().taskId}
      result={Route.useLoaderData()}
      search={Route.useSearch()}
    />
  );
}
