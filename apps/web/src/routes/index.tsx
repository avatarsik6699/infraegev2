import { createFileRoute } from "@tanstack/react-router";
import { FoundationPage } from "~/pages/foundation";
import { siteConfig } from "~/shared/config/site";
import { pageHead } from "~/shared/lib/seo";

export const Route = createFileRoute("/")({
  head: () => {
    const head = pageHead.create({
      title: "infraege — подготовка к ЕГЭ по информатике",
      description: siteConfig.description,
      path: "/",
    });
    return {
      ...head,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(pageHead.createWebsiteStructuredData()),
        },
      ],
    };
  },
  component: FoundationPage,
});
