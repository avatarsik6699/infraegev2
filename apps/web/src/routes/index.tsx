import { createFileRoute } from "@tanstack/react-router";
import { FoundationPage } from "~/pages/foundation";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "infraege — технический фундамент" }] }),
  component: FoundationPage,
});
