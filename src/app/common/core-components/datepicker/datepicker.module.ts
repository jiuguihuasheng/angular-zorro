/**
 *  日付ピッカー機能のモジュールクラス
 *  @version 1.0
 *  @author
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerDirective } from './date-picker.directive';

@NgModule({
  declarations: [DatePickerDirective],
  imports: [
    CommonModule
  ],
  exports: [
    DatePickerDirective
  ]
})
export class DatepickerModule { }
