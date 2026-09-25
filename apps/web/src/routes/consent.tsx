import { createFileRoute } from "@tanstack/react-router";
import { ConsentPage } from "~/pages/privacy";
import { pageHead } from "~/shared/lib/seo";

export const Route = createFileRoute("/consent")({
  head: () =>
    pageHead.create({
      title: "Согласие на обработку данных — infraege",
      description: "Согласие на обработку данных при создании аккаунта.",
      path: "/consent",
      noIndex: true,
    }),
  component: ConsentPage,
});
