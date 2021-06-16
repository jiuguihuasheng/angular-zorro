/**
 *  link機能のモジュールクラス
 *  @version 1.0
 *  @author
 */
import { NgModule } from '@angular/core';
import { RouterModule  } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LinkDirective } from './link.directive';
import { LinkComponent } from './link.component';
import { NavigationModule } from '../navigation/navigation.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NavigationModule
  ],
  declarations: [LinkDirective, LinkComponent],
  exports: [
    LinkDirective, LinkComponent
  ]
})
export class LinkModule { }
