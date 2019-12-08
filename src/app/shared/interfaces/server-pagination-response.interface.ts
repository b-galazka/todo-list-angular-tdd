export interface IServerPaginationResponse<T> {
  data: Array<T>;
  count: number;
  total: number;
  page: number;
  pageCount: number;
}
