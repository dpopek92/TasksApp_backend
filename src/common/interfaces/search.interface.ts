export interface ISearchParams {
  totalItems: number;
  pageNumber: number;
  itemsPerPage: number;
}

export interface ISearchResult<T> {
  content: T[];
  searchParams: ISearchParams;
}
