import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class AppTitleService {

  private appTitle: string;

  public constructor(private titleService: Title) {
    this.appTitle = titleService.getTitle();
  }

  public setPageTitle(pageTitle: string): void {
    this.titleService.setTitle(`${this.appTitle} | ${pageTitle}`);
  }
}
