export function calculateReadingPosition(
  scrollY: number,
  articleTop: number,
  articleHeight: number,
  viewportHeight: number,
): number {
  const travel = Math.max(articleHeight - viewportHeight, 1);
  return Math.min(1, Math.max(0, (scrollY - articleTop) / travel));
}
