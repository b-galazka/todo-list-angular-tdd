import { TestBed } from '@angular/core/testing';
import { ICanBeDeactivated } from 'src/app/shared/interfaces/can-be-deactivated.interface';
import { UnsavedChangesGuard } from './unsaved-changes.guard';

describe('UnsavedChangesGuard', () => {
  let unsavedChangesGuard: UnsavedChangesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnsavedChangesGuard]
    });
  });

  beforeEach(() => {
    unsavedChangesGuard = TestBed.get(UnsavedChangesGuard);
  });

  it('should create', () => {
    expect(unsavedChangesGuard).toBeTruthy();
  });

  describe('#canDeactivate', () => {
    it('should return true if component can be deactivated', () => {
      const componentMock: ICanBeDeactivated = { canBeDeactivated: () => true };

      expect(unsavedChangesGuard.canDeactivate(componentMock)).toBe(true);
    });

    it('should return false if component cannot be deactivated', () => {
      const componentMock: ICanBeDeactivated = { canBeDeactivated: () => false };

      expect(unsavedChangesGuard.canDeactivate(componentMock)).toBe(false);
    });
  });
});
