import { IPaginationParams } from './pagination-params.interface';

export interface IPagination {
  prev?: IPaginationParams;
  next?: IPaginationParams;
}
