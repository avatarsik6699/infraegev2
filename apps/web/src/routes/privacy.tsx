import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "~/pages/privacy";
import { pageHead } from "~/shared/lib/seo";

const description =
  "Какие технические данные обрабатывает infraege и как хранится прогресс обучения.";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageHead.create({
      title: "Обработка данных — infraege",
      description,
      path: "/privacy",
    }),
  component: PrivacyPage,
});
