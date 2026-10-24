import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "~/pages/privacy";
import { pageHead } from "~/shared/lib/seo";

const description =
  "Какие персональные данные обрабатывает Кодумка, зачем, кому передаёт и как их удалить.";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageHead.create({
      title: "Политика обработки персональных данных — Кодумка",
      description,
      path: "/privacy",
    }),
  component: PrivacyPage,
});
