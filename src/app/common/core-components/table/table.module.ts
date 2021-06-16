/**
 *  テーブル機能のモジュールクラス
 *  @version 1.0
 *  @author
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TableComponent,
  SortableColumnDirective,
  SortIconComponent,
  TableBodyComponent,
  TableFooterComponent,
  SelectableRowDblClickDirective,
  TableRadioButtonComponent,
  TableCheckboxComponent,
  TableHeaderCheckboxComponent,
  PaginationComponent,
  PaginationConfig,
} from './table.component';
import { HeaderComponent, FooterComponent, CPTemplateDirective } from './shared';
import { FormsModule } from '@angular/forms';
import { LinkModule } from '../link/link.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LinkModule
  ],
  declarations: [
    TableComponent,
    SortableColumnDirective,
    SortIconComponent,
    TableBodyComponent,
    TableFooterComponent,
    TableRadioButtonComponent,
    TableCheckboxComponent,
    TableHeaderCheckboxComponent,
    HeaderComponent,
    FooterComponent,
    CPTemplateDirective,
    SelectableRowDblClickDirective,
    PaginationComponent
  ],
  exports: [
    TableComponent,
    SortableColumnDirective,
    SortIconComponent,
    TableRadioButtonComponent,
    TableCheckboxComponent,
    TableHeaderCheckboxComponent,
    HeaderComponent,
    FooterComponent,
    CPTemplateDirective,
    SelectableRowDblClickDirective,
    PaginationComponent,
  ],
  providers: [PaginationConfig]
})
export class TableModule { }
