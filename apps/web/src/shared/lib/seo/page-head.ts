import { siteConfig } from "~/shared/config/site";

type PageHeadOptions = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

function create(options: PageHeadOptions) {
  const canonical = new URL(options.path, siteConfig.origin).toString();
  const robots = options.noIndex ? "noindex,nofollow" : "index,follow";

  return {
    meta: [
      { title: options.title },
      { name: "description", content: options.description },
      { name: "robots", content: robots },
      { property: "og:site_name", content: siteConfig.name },
      { property: "og:type", content: options.type ?? "website" },
      { property: "og:title", content: options.title },
      { property: "og:description", content: options.description },
      { property: "og:url", content: canonical },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: options.title },
      { name: "twitter:description", content: options.description },
    ],
    links: [{ rel: "canonical", href: canonical }],
  };
}

export const pageHead = { create } as const;
