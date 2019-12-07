import { NgModule, Optional, SkipSelf } from '@angular/core';

import { config } from 'src/config';
import { CONFIG } from './injection-tokens/config.token';

@NgModule({
  providers: [{ provide: CONFIG, useValue: config }]
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
