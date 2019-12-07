import { isPlatformBrowser } from '@angular/common';
import { InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken('WINDOW');

export function windowFactory(platformId: object): Window | null {
  return isPlatformBrowser(platformId) ? window : null;
}
