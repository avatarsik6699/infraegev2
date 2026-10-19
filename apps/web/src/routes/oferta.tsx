import { createFileRoute } from "@tanstack/react-router";
import { OfferPage } from "~/pages/legal";
import { pageHead } from "~/shared/lib/seo";

export const Route = createFileRoute("/oferta")({
  head: () =>
    pageHead.create({
      title: "Публичная оферта — Кодумка",
      description:
        "Условия предоставления доступа к платным материалам Кодумки.",
      path: "/oferta",
    }),
  component: () => <OfferPage />,
});
