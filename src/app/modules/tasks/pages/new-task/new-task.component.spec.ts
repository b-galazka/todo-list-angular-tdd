import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NewTaskComponent } from './new-task.component';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { TextareaComponent } from 'src/app/shared/components/textarea/textarea.component';
import { SelectComponent } from 'src/app/shared/components/select/select.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppTitleService } from 'src/app/core/services/app-title.service';
import { AppTitleServiceMock } from 'src/mocks/services/app-title.service.mock';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';

describe('NewTaskComponent', () => {
  let component: NewTaskComponent;
  let fixture: ComponentFixture<NewTaskComponent>;
  let appTitleService: AppTitleService;
  let location: Location;

  beforeEach(async(() => {

    const routes: Routes = [
      { path: '**', component: NewTaskComponent }
    ];

    TestBed.configureTestingModule({
      declarations: [
        NewTaskComponent,
        TaskFormComponent,
        TextInputComponent,
        TextareaComponent,
        SelectComponent
      ],
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule.withRoutes(routes)],
      providers: [
        { provide: AppTitleService, useClass: AppTitleServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTaskComponent);
    component = fixture.componentInstance;
    appTitleService = TestBed.get(AppTitleService);
    location = TestBed.get(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set page title on init', () => {

    const spy = spyOn(appTitleService, 'setPageTitle');

    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith('new task');
  });

  it('should navigate to tasks list on tasks list link click', fakeAsync(() => {

    const linkElem: HTMLAnchorElement = fixture.debugElement
      .query(By.css('.tasks-list-link'))
      .nativeElement;

    linkElem.click();
    tick();

    expect(location.path()).toBe('/tasks/1');
  }));

  // TODO: handle form submit
  // (make request, disable button, redirect to created task details on success)

  // TODO: canDeactivate guard and popup onbeforeunload if form is dirty
});
