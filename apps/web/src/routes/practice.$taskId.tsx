import { practiceCatalog } from "~/entities/practice-task";
import { createFileRoute } from "@tanstack/react-router";
import { PracticeTaskPage, getPracticeTask } from "~/pages/practice-task";
import { pageHead } from "~/shared/lib/seo";
export const Route = createFileRoute("/practice/$taskId")({
  validateSearch: practiceCatalog.taskSearch,
  loader: ({ params }) => getPracticeTask({ data: params.taskId }),
  staleTime: 0,
  head: ({ loaderData, params }) =>
    pageHead.create({
      title: `${loaderData?.detail?.task.title ?? "Задача недоступна"} — infraege`,
      description:
        loaderData?.detail?.answerInstruction ??
        "Самостоятельная практика по информатике.",
      path: `/practice/${params.taskId}`,
      type: "article",
      noIndex: !loaderData?.detail?.catalogVisible,
    }),
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
