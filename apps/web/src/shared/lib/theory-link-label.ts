type TheorySection = { readonly id: string; readonly navLabel: string };

/**
 * F54: a theory link is named after the heading it leads to; a link
 * without a known section reads «Теория».
 */
export const theoryLinkLabel = (
  theory: readonly TheorySection[] | undefined,
  section: string | null | undefined,
): string =>
  (section && theory?.find((block) => block.id === section)?.navLabel) ||
  "Теория";
