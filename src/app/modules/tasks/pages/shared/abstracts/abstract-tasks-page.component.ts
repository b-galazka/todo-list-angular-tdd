import { BehaviorSubject } from 'rxjs';
import { RequestStatus } from 'src/app/shared/enums/request-status.enum';

export abstract class AbstractTasksPageComponent {
  public readonly RequestStatus = RequestStatus;

  public isPending$ = new BehaviorSubject<boolean>(false);
}
