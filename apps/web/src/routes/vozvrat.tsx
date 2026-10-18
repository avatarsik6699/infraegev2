import { createFileRoute } from "@tanstack/react-router";
import { RefundPage } from "~/pages/legal";
import { pageHead } from "~/shared/lib/seo";

export const Route = createFileRoute("/vozvrat")({
  head: () =>
    pageHead.create({
      title: "Возврат оплаты — infraege",
      description:
        "Как вернуть деньги за неиспользованные дни доступа к infraege.",
      path: "/vozvrat",
    }),
  component: RefundPage,
});
