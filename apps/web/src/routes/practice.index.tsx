import { createFileRoute } from "@tanstack/react-router";
import {
  PracticeCatalogPage,
  getPracticeCatalog,
} from "~/pages/practice-catalog";
import { practiceCatalog } from "~/entities/practice-task";
import { pageHead } from "~/shared/lib/seo";
export const Route = createFileRoute("/practice/")({
  validateSearch: practiceCatalog.search,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => getPracticeCatalog({ data: deps }),
  staleTime: 0,
  head: ({ loaderData, match }) =>
    pageHead.create({
      title: "Практика — infraege",
      description:
        "Самостоятельные задачи по информатике: выбирайте навык, номер ЕГЭ и сложность, решайте с подсказками и разбором.",
      path: "/practice",
      noIndex:
        loaderData?.status !== "ready" ||
        Object.values(match.search).some((v) => v !== undefined),
    }),
  component: PracticeCatalogRoute,
});
function PracticeCatalogRoute() {
  return (
    <PracticeCatalogPage
      search={Route.useSearch()}
      result={Route.useLoaderData()}
    />
  );
}
