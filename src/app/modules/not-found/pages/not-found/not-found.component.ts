import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AppTitleService } from 'src/app/core/services/app-title.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent implements OnInit {

  public constructor(private readonly appTitleService: AppTitleService) {}

  public ngOnInit(): void {
    this.appTitleService.setPageTitle('not found');
  }
}
