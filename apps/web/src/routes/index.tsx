import { createFileRoute } from "@tanstack/react-router";
import { listPublishedTopics } from "~/entities/content/api/server-loaders";
import { HomePage } from "~/pages/home/ui/home-page";

export const Route = createFileRoute("/")({
  loader: async () => ({ topics: await listPublishedTopics() }),
  head: () => ({
    meta: [
      {
        title:
          "Подготовка к ЕГЭ по информатике — теория, визуализация, практика",
      },
      {
        name: "description",
        content:
          "Темы ЕГЭ по информатике с разбором, диаграммами и практикой, привязанной к теории — не текстовая простыня без структуры.",
      },
    ],
  }),
  component: HomeRoute,
});

function HomeRoute() {
  const { topics } = Route.useLoaderData();
  return <HomePage topics={topics} />;
}
