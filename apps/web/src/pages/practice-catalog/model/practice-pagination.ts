export const practicePagination = {
  pages(current: number, total: number): number[] {
    if (total <= 7)
      return Array.from({ length: total }, (_, index) => index + 1);
    const start = Math.max(2, Math.min(current - 1, total - 4));
    const end = Math.min(total - 1, Math.max(current + 1, 5));
    const pages = [1];
    for (let page = start; page <= end; page += 1) pages.push(page);
    pages.push(total);
    return pages.flatMap((page, index) =>
      index > 0 && page - pages[index - 1] === 2 ? [page - 1, page] : [page],
    );
  },
};
