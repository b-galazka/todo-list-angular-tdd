import { BehaviorSubject } from 'rxjs';

export abstract class AbstractTasksPageComponent {
  public isPending$ = new BehaviorSubject<boolean>(false);
}
