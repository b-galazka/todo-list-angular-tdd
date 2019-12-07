import { NgModule, Optional, PLATFORM_ID, SkipSelf } from '@angular/core';

import { config } from 'src/config';
import { CONFIG } from './injection-tokens/config.token';
import { WINDOW, windowFactory } from './injection-tokens/window.token';

@NgModule({
  providers: [
    { provide: CONFIG, useValue: config },
    { provide: WINDOW, useFactory: windowFactory, deps: [PLATFORM_ID] }
  ]
})
export class CoreModule {
  public constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule has already been loaded. Import Core modules in the AppModule only.'
      );
    }
  }
}
