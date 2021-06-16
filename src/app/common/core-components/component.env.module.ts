import { NgModule, ModuleWithProviders } from '@angular/core';
import { RestService } from '../core-services/http.service';

@NgModule({})
export class CommponentEnvModule {

  public static forRoot(environment: any, restApi: any): ModuleWithProviders<CommponentEnvModule> {

    return {
      ngModule: CommponentEnvModule,
      providers: [
        RestService,
        {
          provide: 'env', // you can also use InjectionToken
          useValue: environment
        },
        {
          provide: 'restApi', // you can also use InjectionToken
          useValue: restApi
        }
      ]
    };
  }
}
