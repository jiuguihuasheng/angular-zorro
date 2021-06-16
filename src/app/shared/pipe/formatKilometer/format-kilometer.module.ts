/**
 *  KM pipe モジュールクラス
 *  @version 1.0
 *  @author
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatKilometer } from './format-kilometer.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FormatKilometer],
  exports: [FormatKilometer],
})
export class FormatKilometerPipeModule { }
