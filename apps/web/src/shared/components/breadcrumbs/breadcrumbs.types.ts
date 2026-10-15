export namespace BreadcrumbsTypes {
  export type Item = {
    label: string;
    /** A link to an ancestor; the last item (current page) has none, and an
     *  ancestor that is this very page (a topic on its first subtopic) neither. */
    to?: string;
    params?: Record<string, string>;
  };

  export type Props = {
    items: readonly Item[];
    className?: string;
    /** Extra attributes for the `nav` (e.g. a data hook). */
    navProps?: Record<`data-${string}`, string | boolean>;
  };
}
