/**
 *  date pipeモジュールクラス
 *  @version 1.0
 *  @author
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatDatePipe } from './format-date.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FormatDatePipe],
  exports: [FormatDatePipe],
})
export class FormatDatePipeModule { }
