import { createFileRoute } from "@tanstack/react-router";
import { TopicCatalogPage } from "~/pages/topic-catalog";
import { pageHead } from "~/shared/lib/seo";

export const Route = createFileRoute("/ege/")({
  head: () =>
    pageHead.create({
      title: "Темы ЕГЭ по информатике — infraege",
      description:
        "Все темы ЕГЭ по информатике: 25 учебных направлений для заданий 1–27, с теорией и практикой в опубликованных уроках.",
      path: "/ege",
    }),
  component: TopicCatalogPage,
});
