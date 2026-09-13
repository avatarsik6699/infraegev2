import type { PracticeCatalogTypes } from "~/entities/practice-task";
import type { getPracticeCatalog } from "./api/get-practice-catalog";
export namespace PracticeCatalogPageTypes {
  export type Props = {
    search: PracticeCatalogTypes.Search;
    result: Awaited<ReturnType<typeof getPracticeCatalog>>;
  };
}
