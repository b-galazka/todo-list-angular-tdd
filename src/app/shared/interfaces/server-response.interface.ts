import { IPagination } from './pagination.interface';

export interface IServerResponse<T> {
  data: T;
  pagination?: IPagination;
}
