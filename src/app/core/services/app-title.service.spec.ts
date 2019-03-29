import { TestBed } from '@angular/core/testing';

import { AppTitleService } from './app-title.service';
import { Title } from '@angular/platform-browser';

describe('AppTitleService', () => {

  let appTitleService: AppTitleService;
  let titleService: Title;

  beforeEach(() => {

    document.title = 'Base app title';

    TestBed.configureTestingModule({
      providers: [Title]
    });

    appTitleService = TestBed.get(AppTitleService);
    titleService = TestBed.get(Title);
  });

  it('should be created', () => {
    expect(appTitleService).toBeTruthy();
  });

  describe('#setPageTitle', () => {

    it('should set page title', () => {

      const spy = spyOn(titleService, 'setTitle');

      appTitleService.setPageTitle('page title');

      expect(spy).toHaveBeenCalledWith('Base app title | page title');
    });
  });
});
