import { createFileRoute } from "@tanstack/react-router";
import { TermsPage } from "~/pages/legal/ui/terms-page";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Пользовательское соглашение" }] }),
  component: TermsPage,
});
