import { Location } from '@angular/common';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AppTitleService } from 'src/app/core/services/app-title.service';
import { AppTitleServiceMock } from 'src/mocks/services/app-title.service.mock';
import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let debugElem: DebugElement;
  let location: Location;
  let appTitleService: AppTitleService;

  beforeEach(async(() => {
    const routes: Routes = [{ path: '**', component: NotFoundComponent }];

    TestBed.configureTestingModule({
      declarations: [NotFoundComponent],
      imports: [RouterTestingModule.withRoutes(routes)],
      providers: [{ provide: AppTitleService, useClass: AppTitleServiceMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    location = TestBed.get(Location);
    appTitleService = TestBed.get(AppTitleService);
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    debugElem = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to homepage on button click', fakeAsync(() => {
    const button: HTMLElement = debugElem.query(By.css('[data-test-id="homepage-button"]'))
      .nativeElement;

    button.click();
    tick();

    expect(location.path()).toBe('/');
  }));

  describe('#ngOnInit', () => {
    it('should update page title', () => {
      const spy = spyOn(appTitleService, 'setPageTitle');

      component.ngOnInit();

      expect(spy).toHaveBeenCalledWith('not found');
    });
  });
});
