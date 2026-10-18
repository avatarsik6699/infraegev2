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
  const socialImage = new URL(
    siteConfig.socialImagePath,
    siteConfig.origin,
  ).toString();
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
      { property: "og:locale", content: "ru_RU" },
      { property: "og:image", content: socialImage },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: siteConfig.socialImageAlt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: options.title },
      { name: "twitter:description", content: options.description },
      { name: "twitter:image", content: socialImage },
      { name: "twitter:image:alt", content: siteConfig.socialImageAlt },
    ],
    links: [{ rel: "canonical", href: canonical }],
  };
}

function createWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: "infraege.ru",
    url: `${siteConfig.origin}/`,
    description: siteConfig.description,
    inLanguage: "ru",
  } as const;
}

/**
 * Change 192 (SPEC §6.1, no cloaking): a page whose text is partly paid says so;
 * the paywall section carries the global class `paywall` for `cssSelector`.
 * Robots get exactly what a guest gets.
 */
function createPaidArticleStructuredData(options: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: options.title,
    description: options.description,
    url: new URL(options.path, siteConfig.origin).toString(),
    inLanguage: "ru",
    isAccessibleForFree: false,
    hasPart: {
      "@type": "WebPageElement",
      isAccessibleForFree: false,
      cssSelector: ".paywall",
    },
  } as const;
}

/** The head of a page with a paid part: the usual tags plus the paid-article data. */
function withPaidArticle(
  head: ReturnType<typeof create>,
  options: { title: string; description: string; path: string },
) {
  return {
    ...head,
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(createPaidArticleStructuredData(options)),
      },
    ],
  };
}

export const pageHead = {
  create,
  createWebsiteStructuredData,
  createPaidArticleStructuredData,
  withPaidArticle,
} as const;
