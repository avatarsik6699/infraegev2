import { createFileRoute } from "@tanstack/react-router";
import { FoundationPage } from "~/pages/foundation";
import { siteConfig } from "~/shared/config/site";
import { pageHead } from "~/shared/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead.create({
      title: "infraege — подготовка к ЕГЭ по информатике",
      description: siteConfig.description,
      path: "/",
    }),
  component: FoundationPage,
});
