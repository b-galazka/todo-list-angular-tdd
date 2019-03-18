import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NotFoundComponent } from './not-found.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes } from '@angular/router';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let debugElem: DebugElement;
  let location: Location;

  beforeEach(async(() => {

    const routes: Routes = [
      { path: '**', component: NotFoundComponent }
    ];

    TestBed.configureTestingModule({
      declarations: [NotFoundComponent],
      imports: [RouterTestingModule.withRoutes(routes)]
    })
    .compileComponents();
  }));

  beforeEach(() => {

    location = TestBed.get(Location);
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    debugElem = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to homepage on button click', fakeAsync(() => {

    const button: HTMLElement = debugElem.query(By.css('.homepage-button')).nativeElement;

    button.click();
    tick();

    expect(location.path()).toBe('/');
  }));
});
