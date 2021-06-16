/**
 *  チェックボックス機能のモジュールクラス
 *  @version 1.0
 *  @author
 */
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from './checkbox.component';

@NgModule({
  declarations: [CheckboxComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CheckboxComponent
  ]
})
export class CheckboxModule { }
