import { createFileRoute } from "@tanstack/react-router";
import { RefundPage } from "~/pages/legal";
import { pageHead } from "~/shared/lib/seo";

export const Route = createFileRoute("/vozvrat")({
  head: () =>
    pageHead.create({
      title: "Возврат оплаты — Кодумка",
      description:
        "Как вернуть деньги за неиспользованные дни доступа к Кодумке.",
      path: "/vozvrat",
    }),
  component: RefundPage,
});
