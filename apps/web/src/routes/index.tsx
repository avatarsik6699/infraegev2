import { createFileRoute } from "@tanstack/react-router";
import { FoundationPage, foundationFeaturedTask } from "~/pages/foundation";
import { siteConfig } from "~/shared/config/site";
import { pageHead } from "~/shared/lib/seo";

export const Route = createFileRoute("/")({
  loader: () => foundationFeaturedTask.load(),
  staleTime: 0,
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
  component: FoundationRoute,
});

function FoundationRoute() {
  return <FoundationPage featuredTask={Route.useLoaderData()} />;
}
