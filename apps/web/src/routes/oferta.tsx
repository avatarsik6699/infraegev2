import { createFileRoute } from "@tanstack/react-router";
import { OfferPage } from "~/pages/legal";
import { pageHead } from "~/shared/lib/seo";

export const Route = createFileRoute("/oferta")({
  head: () =>
    pageHead.create({
      title: "Публичная оферта — infraege",
      description:
        "Условия предоставления доступа к платным материалам infraege.",
      path: "/oferta",
    }),
  component: () => <OfferPage />,
});
