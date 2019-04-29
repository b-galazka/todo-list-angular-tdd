import { Component, OnInit } from '@angular/core';
import { AppTitleService } from 'src/app/core/services/app-title.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['../shared/styles/tasks-page.scss', './new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  public constructor(private readonly appTitleService: AppTitleService) {}

  public ngOnInit(): void {
    this.appTitleService.setPageTitle('new task');
  }
}
