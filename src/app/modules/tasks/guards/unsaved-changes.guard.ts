import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ICanBeDeactivated } from 'src/app/core/models/can-be-deactivated.model';

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<ICanBeDeactivated> {

  public canDeactivate(component: ICanBeDeactivated): boolean {
    return component.canBeDeactivated();
  }
}
