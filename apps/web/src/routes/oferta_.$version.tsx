import { createFileRoute, notFound } from "@tanstack/react-router";
import { OfferPage, offerVersions } from "~/pages/legal";
import { pageHead } from "~/shared/lib/seo";

/** An earlier edition of the offer stays readable at its date. */
export const Route = createFileRoute("/oferta_/$version")({
  loader: ({ params }) => {
    if (!offerVersions.some((offer) => offer.version === params.version))
      throw notFound();
  },
  head: ({ params }) =>
    pageHead.create({
      title: `Оферта, редакция ${params.version} — infraege`,
      description: "Прежняя редакция публичной оферты infraege.",
      path: `/oferta/${params.version}`,
      noIndex: true,
    }),
  component: OfferVersionRoute,
});

function OfferVersionRoute() {
  return <OfferPage version={Route.useParams().version} />;
}
