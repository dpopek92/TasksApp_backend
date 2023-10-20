export const getPaginationParams = (
  pageNumber: number,
  itemsPerPage: number,
  totalItems: number,
): {
  itemsPerPage: number;
  totalItems: number;
  skipped: number;
} => {
  const skipped =
    pageNumber && itemsPerPage ? (pageNumber - 1) * itemsPerPage : 0;
  return {
    itemsPerPage: Number(itemsPerPage),
    totalItems,
    skipped,
  };
};
