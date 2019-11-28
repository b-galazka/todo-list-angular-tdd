import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class AppTitleService {
  private readonly appTitle: string;

  public constructor(private readonly titleService: Title) {
    this.appTitle = titleService.getTitle();
  }

  public setPageTitle(pageTitle: string): void {
    this.titleService.setTitle(`${this.appTitle} | ${pageTitle}`);
  }
}
