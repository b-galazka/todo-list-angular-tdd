import { Observable } from 'rxjs';

export interface IDataService<T> {
  state: T;
  state$: Observable<T>;
}
