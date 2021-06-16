/**
 *  router機能のモジュールクラス
 *  @version 1.0
 *  @author
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalsModule } from '../modals/modals.module';
import { NavigationDirective } from './navigation.directive';

import { NavigationStatusService } from './navigation-status.service';
import { NavigationGuardService } from './navigation-guard.service';
import { NavigationService } from './navigation.service';

@NgModule({
  imports: [
    CommonModule,
    ModalsModule
  ],
  declarations: [
    NavigationDirective,
  ],
  exports: [
    NavigationDirective
  ]
})
export class NavigationModule { }
