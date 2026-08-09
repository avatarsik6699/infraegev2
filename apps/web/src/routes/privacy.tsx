import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "~/pages/privacy";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Политика обработки персональных данных" }] }),
  component: PrivacyPage,
});
