import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IServerResponse } from '../models/server-response.model';
import { ITask } from '../models/task.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private static readonly RECORDS_PER_PAGE = 15;

  public constructor(private readonly httpClient: HttpClient) {}

  private static readonly mapServerReponseToData = <T>(response: IServerResponse<T>): T => {
    return response.data;
  }

  public getTasks(page: number): Observable<Array<ITask>> {

    const paramsObj = {
      offset: String((page - 1) * TasksService.RECORDS_PER_PAGE),
      limit: String(TasksService.RECORDS_PER_PAGE)
    };

    const params = new HttpParams({ fromObject: paramsObj });

    return this.httpClient
      .get<IServerResponse<Array<ITask>>>(`${environment.apiUrl}/tasks`, { params })
      .pipe(map(TasksService.mapServerReponseToData));
  }
}
