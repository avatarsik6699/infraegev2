import {
  type AnyRouteMatch,
  Asset,
  useRouter,
  useRouterState,
  useTags,
} from "@tanstack/react-router";

/** One owner of title/robots: never add a second title from an error boundary. */
export const AppDocumentHead: React.FC = () => {
  const router = useRouter();
  const state = useRouterState();
  const tags = useTags();
  const missing = state.matches.some(
    (match: AnyRouteMatch) => match.status === "notFound" || match._notFound,
  );
  const failed = state.matches.some(
    (match: AnyRouteMatch) => match.status === "error",
  );
  let title: string | undefined;
  if (missing) title = "Страница не найдена — infraege";
  else if (failed) title = "Не удалось загрузить страницу — infraege";
  const visibleTags = title
    ? tags.filter((tag) => {
        if (tag.tag === "title") return false;
        const name: unknown = tag.attrs?.name;
        const property: unknown = tag.attrs?.property;
        if (
          tag.tag === "meta" &&
          (name === "robots" ||
            name === "description" ||
            (typeof property === "string" && property.startsWith("og:")) ||
            (typeof name === "string" && name.startsWith("twitter:")))
        )
          return false;
        return !(tag.tag === "link" && tag.attrs?.rel === "canonical");
      })
    : tags;

  return (
    <>
      {visibleTags.map((tag) => (
        <Asset
          {...tag}
          key={`tsr-meta-${JSON.stringify(tag)}`}
          nonce={router.options.ssr?.nonce}
        />
      ))}
      {title ? (
        <>
          <title>{title}</title>
          <meta name="robots" content="noindex,nofollow" />
        </>
      ) : null}
    </>
  );
};
