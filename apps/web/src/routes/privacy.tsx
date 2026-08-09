import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "~/pages/legal/ui/privacy-page";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Политика обработки персональных данных" }] }),
  component: PrivacyPage,
});
