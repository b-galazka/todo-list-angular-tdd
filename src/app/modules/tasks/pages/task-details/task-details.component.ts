import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from 'src/app/core/services/tasks.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {

  public constructor(
    private readonly route: ActivatedRoute,
    public readonly tasksService: TasksService
  ) {}

  public ngOnInit(): void {

    const taskId = this.route.snapshot.paramMap.get('taskId');

    this.tasksService.getTask(+taskId).subscribe();
  }
}
