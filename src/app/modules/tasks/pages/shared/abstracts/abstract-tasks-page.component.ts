import { BehaviorSubject } from 'rxjs';
import { RequestStatus } from 'src/app/core/models/server-request.model';

export abstract class AbstractTasksPageComponent {
  public readonly RequestStatus = RequestStatus;

  public isPending$ = new BehaviorSubject<boolean>(false);
}
