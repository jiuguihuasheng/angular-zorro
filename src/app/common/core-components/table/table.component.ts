/**
 *  テーブル
 *  @version 1.0
 *  @author
 */
import {
  Component, HostListener, OnInit, Directive,
  AfterContentInit, Input, Output, EventEmitter, ElementRef,
  ContentChildren, TemplateRef, QueryList, ViewChild, NgZone, HostBinding, Renderer2, forwardRef, ChangeDetectorRef
} from '@angular/core';

import { DomHandler } from '../dom/domhandler';
import { ObjectUtils } from '../utils/objectutils';
import { OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';
import { Subject, Subscription, Observable } from 'rxjs';
import { CPTemplateDirective } from './shared';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import * as _ from 'lodash';

export interface SortMeta {
  field: string;
  order: number;
}

export interface SortEvent {
  data?: any[];
  mode?: string;
  field?: string;
  order?: number;
  multiSortMeta?: SortMeta[];
}


@Injectable()
export class TableService {
  private sortSource = new Subject<SortMeta | SortMeta[]>();
  private selectionSource = new Subject();
  private contextMenuSource = new Subject<any>();
  private valueSource = new Subject<any>();
  private totalRecordsSource = new Subject<any>();

  sortSource$ = this.sortSource.asObservable();
  selectionSource$ = this.selectionSource.asObservable();
  contextMenuSource$ = this.contextMenuSource.asObservable();
  valueSource$ = this.valueSource.asObservable();
  totalRecordsSource$ = this.totalRecordsSource.asObservable();

  onSort(sortMeta: SortMeta | SortMeta[]) {
    this.sortSource.next(sortMeta);
  }

  onSelectionChange() {
    this.selectionSource.next();
  }

  onContextMenu(data: any) {
    this.contextMenuSource.next(data);
  }

  onValueChange(value: any) {
    this.valueSource.next(value);
  }

  onTotalRecordsChange(value: number) {
    this.totalRecordsSource.next(value);
  }
}

@Component({
  // tslint:disable-next-line
  selector: 'cp-table',
  styleUrls: ['table.component.css'],
  templateUrl: 'table.component.html',
  providers: [DomHandler, ObjectUtils, TableService]
})

export class TableComponent implements OnInit, AfterContentInit {
  @Input() columns: any[];
  @Input() tableStyle: any;
  @Input() tableStyleClass: string;
  @Input() tableTheadStyleClass: string;
  @Input() tableTbodyStyleClass: string;
  @Input() tablePageStyleClass: string;
  @Input() tablePageBtnStyleClass: string;
  @Input() filterEmpty = true;
  @Input() paginator = true;
  @Input() pageDisabled = false;
  @Input() rows = 10;
  @Input() pageMaxSize = 5;
  @Input() paginatorPosition = 'top';  // top , bottom, both
  @Input() boundaryLinks = true;
  @Input() selectionMode = false;
  @Input() metaKeySelection: boolean;
  @Input() sortMode = 'single';  // multiple, single
  @Input() customSort = false;
  @Input() defaultSortOrder = 1;
  @Input() dataKey: string;
  @Input() resetPageOnSort = false;
  @Input() compareSelectionBy = 'deepEquals';  // equals , deepEquals
  @Input() previousText = '最初';
  @Input() lastText = '最後';
  @Output() selectionChange: EventEmitter<any> = new EventEmitter();
  @Output() rowSelect: EventEmitter<any> = new EventEmitter();
  @Output() rowUnselect: EventEmitter<any> = new EventEmitter();
  @Output() pageChanged: EventEmitter<any> = new EventEmitter();
  @Output() afterSort: EventEmitter<any> = new EventEmitter();
  @Output() sortFunction: EventEmitter<any> = new EventEmitter();
  @Output() headerCheckboxToggle: EventEmitter<any> = new EventEmitter();

  _value: any[] = [];
  _currentPage;
  _footerValue: any = {};
  _totalRecords = 0;
  _count = 0;
  _sortField: string;
  _sortOrder = 1;
  _multiSortMeta: any;
  _selection: any;
  _first: number;

  selectionKeys: any = {};
  initialized: boolean;
  virtualScrollCallback: Function;
  anchorRowIndex: number;
  rangeRowIndex: number;
  rowTouched: boolean;
  smallnumPages: number;
  preventSelectionSetterPropagation: boolean;

  lazy = false;
  lazyLoad: EventEmitter<any> = new EventEmitter();

  headerTemplate: TemplateRef<any>;
  bodyTemplate: TemplateRef<any>;
  captionTemplate: TemplateRef<any>;
  emptyMessageTemplate: TemplateRef<any>;
  footerTemplate: TemplateRef<any>;
  btnTemplate: TemplateRef<any>;

  @ContentChildren(CPTemplateDirective) templates: QueryList<CPTemplateDirective>;

  constructor(public el: ElementRef, public domHandler: DomHandler,
    public objectUtils: ObjectUtils, public zone: NgZone, public tableService: TableService) { }

  ngOnInit() {
    if (this.lazy) {
      this.lazyLoad.emit(this.createLazyLoadMetadata());
    }
    this.initialized = true;
  }

  ngAfterContentInit() {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case 'caption':
          this.captionTemplate = item.template;
          break;

        case 'header':
          this.headerTemplate = item.template;
          break;

        case 'body':
          this.bodyTemplate = item.template;
          break;

        case 'footer':
          this.footerTemplate = item.template;
          break;

        case 'emptymessage':
          this.emptyMessageTemplate = item.template;
          break;
        case 'btns':
          this.btnTemplate = item.template;
          break;
        default:
          console.error('no supproted template.');
      }
    });
  }

  filterEmptyValue() {
    this._value.forEach(val => {
      const keys = Object.keys(val);
      keys.map(key => {
        if (key !== 'cycmremarks') {
          if (_.isEmpty(_.toString(val[key]))) {
            val[key] = null;
          }
        }
      });
    });
  }

  @Input() set currentPage(val) {
    this._currentPage = val;
  }

  get currentPage() {
    return this._currentPage;
  }

  @Input() get value(): any[] {
    return this._value;
  }
  set value(val: any[]) {
    this._value = val;
    if (this._value && this._value.length >= 0 && this.filterEmpty) {
      this.filterEmptyValue();
    }

    if (!this.totalRecords || this.totalRecords === 0) {
      this.totalRecords = (this._value ? this._value.length : 0);
    }

    if (this.sortMode === 'single' && this.sortField) {
      this.sortSingle();
    } else if (this.sortMode === 'multiple' && this.multiSortMeta) {
      this.sortMultiple();
    }
    this.tableService.onValueChange(val);
  }

  @Input() get footerValue(): any {
    return this._footerValue;
  }
  set footerValue(val: any) {
    this._footerValue = val;
  }

  @Input() get totalRecords(): number {
    return this._totalRecords;
  }

  set totalRecords(val: number) {
    this._totalRecords = val;
    this.tableService.onTotalRecordsChange(this._totalRecords);
  }

  // @Input() get count(): number {
  //   return this._count;
  // }

  // set count(val: number) {
  //   this._count = val;
  // }

  get first(): number {
    if (!this.currentPage) {
      this.currentPage = 1;
    }
    this._first = (this.currentPage - 1) * this.rows;
    return this._first;
  }


  @Input() get sortField(): string {
    return this._sortField;
  }

  set sortField(val: string) {
    this._sortField = val;

    // avoid triggering lazy load prior to lazy initialization at onInit
    if (!this.lazy || this.initialized) {
      if (this.sortMode === 'single') {
        this.sortSingle();
      }
    }
  }
  @Input() get sortOrder(): number {
    return this._sortOrder;
  }
  set sortOrder(val: number) {
    this._sortOrder = val;

    // avoid triggering lazy load prior to lazy initialization at onInit
    if (!this.lazy || this.initialized) {
      if (this.sortMode === 'single') {
        this.sortSingle();
      }
    }
  }

  @Input() get multiSortMeta(): SortMeta[] {
    return this._multiSortMeta;
  }

  set multiSortMeta(val: SortMeta[]) {
    this._multiSortMeta = val;
    if (this.sortMode === 'multiple') {
      this.sortMultiple();
    }
  }

  @Input() get selection(): any {
    return this._selection;
  }


  set selection(val: any) {
    this._selection = val;

    if (!this.preventSelectionSetterPropagation) {
      this.updateSelectionKeys();
      this.tableService.onSelectionChange();
    }
    this.preventSelectionSetterPropagation = false;
  }

  updateSelectionKeys() {
    if (this.dataKey && this._selection) {
      this.selectionKeys = {};
      if (Array.isArray(this._selection)) {
        for (const data of this._selection) {
          this.selectionKeys[String(this.objectUtils.resolveFieldData(data, this.dataKey))] = 1;
        }
      } else {
        this.selectionKeys[String(this.objectUtils.resolveFieldData(this._selection, this.dataKey))] = 1;
      }
    }
  }

  doPageChange = ($event) => {
    if ($event.page === this.currentPage) {
      return;
    }
    this.currentPage = $event.page;
    this.rows = $event.itemsPerPage;
    if (this.lazy) {
      this.lazyLoad.emit(this.createLazyLoadMetadata());
    }
    this.pageChanged.emit({
      currentPage: this.currentPage,
      first: this.first,
      rows: this.rows
    });

    this.tableService.onValueChange(this.value);
  }

  createLazyLoadMetadata = () => {
    return {
      currentPage: this.currentPage,
      rows: this.rows,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      multiSortMeta: this.multiSortMeta
    };
  }

  isEmpty() {
    const data = this.value;
    return data == null || data.length === 0;
  }

  public reset() {
    this._sortField = null;
    this._sortOrder = 1;
    this._multiSortMeta = null;
    this.tableService.onSort(null);
    this.currentPage = 1;
    if (this.lazy) {
      this.lazyLoad.emit(this.createLazyLoadMetadata());
    } else {
      this.totalRecords = (this._value ? this._value.length : 0);
    }
  }


  sort = (event) => {
    const originalEvent = event.originalEvent;

    if (this.sortMode === 'single') {
      this._sortOrder = (this.sortField === event.field) ? this.sortOrder * -1 : this.defaultSortOrder;
      this._sortField = event.field;
      this.sortSingle();
    }
    if (this.sortMode === 'multiple') {
      const metaKey = originalEvent.metaKey || originalEvent.ctrlKey;
      const sortMeta = this.getSortMeta(event.field);

      if (sortMeta) {
        if (!metaKey) {
          this._multiSortMeta = [{ field: event.field, order: sortMeta.order * -1 }];
        } else {
          sortMeta.order = sortMeta.order * -1;
        }
      } else {
        if (!metaKey || !this.multiSortMeta) {
          this._multiSortMeta = [];
        }
        this.multiSortMeta.push({ field: event.field, order: this.defaultSortOrder });
      }
      this.sortMultiple();
    }
  }

  getCurrentPageData = () => {
    if (!this.value) {
      return;
    }
    let end: number;
    if (this.first + this.rows > this.value.length) {
      end = this.value.length;
    }

    return this.value.slice(this.first, end);
  }


  sortSingle() {
    let toSortData = [];
    if (this.sortField && this.sortOrder) {
      if (this.resetPageOnSort) {
        this.currentPage = 1;
        toSortData = this.value;
      } else {
        toSortData = this.getCurrentPageData();  // TODO
      }

      if (this.lazy) {
        this.lazyLoad.emit(this.createLazyLoadMetadata());
      } else if (this.value) {
        if (this.customSort) {
          this.sortFunction.emit({
            data: toSortData,
            mode: this.sortMode,
            field: this.sortField,
            order: this.sortOrder
          });
        } else {
          this.value.sort((data1, data2) => {
            const value1 = this.objectUtils.resolveFieldData(data1, this.sortField);
            const value2 = this.objectUtils.resolveFieldData(data2, this.sortField);
            let result = null;
            if (value1 == null && value2 != null) {
              result = -1;
            } else if (value1 != null && value2 == null) {
              result = 1;
            } else if (value1 == null && value2 == null) {
              result = 0;
            } else if (typeof value1 === 'string' && typeof value2 === 'string') {
              result = value1.localeCompare(value2);
            } else {
              result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
            }
            return (this.sortOrder * result);
          });
        }
      }

      const sortMeta: SortMeta = {
        field: this.sortField,
        order: this.sortOrder
      };

      this.afterSort.emit(sortMeta);
      this.tableService.onSort(sortMeta);
    }
  }

  sortMultiple() {
    if (this.multiSortMeta) {
      if (this.lazy) {
        this.lazyLoad.emit(this.createLazyLoadMetadata());
      } else if (this.value) {
        if (this.customSort) {
          this.sortFunction.emit({
            data: this.value,
            mode: this.sortMode,
            multiSortMeta: this.multiSortMeta
          });
        } else {
          this.value.sort((data1, data2) => {
            return this.multisortField(data1, data2, this.multiSortMeta, 0);
          });
        }
      }

      this.afterSort.emit({
        multisortmeta: this.multiSortMeta
      });
      this.tableService.onSort(this.multiSortMeta);
    }
  }

  multisortField(data1, data2, multiSortMeta, index) {
    const value1 = this.objectUtils.resolveFieldData(data1, multiSortMeta[index].field);
    const value2 = this.objectUtils.resolveFieldData(data2, multiSortMeta[index].field);
    let result = null;

    if (value1 == null && value2 != null) {
      result = -1;
    } else if (value1 != null && value2 == null) {
      result = 1;
    } else if (value1 == null && value2 == null) {
      result = 0;
    }
    if (typeof value1 === 'string' || value1 instanceof String) {
      if (value1.localeCompare && (value1 !== value2)) {
        return (multiSortMeta[index].order * value1.localeCompare(value2));
      }
    } else {
      result = (value1 < value2) ? -1 : 1;
    }

    if (value1 === value2) {
      return (multiSortMeta.length - 1) > (index) ? (this.multisortField(data1, data2, multiSortMeta, index + 1)) : 0;
    }

    return (multiSortMeta[index].order * result);
  }

  getSortMeta(field: string) {
    if (this.multiSortMeta && this.multiSortMeta.length) {
      for (let i = 0; i < this.multiSortMeta.length; i++) {
        if (this.multiSortMeta[i].field === field) {
          return this.multiSortMeta[i];
        }
      }
    }
    return null;
  }

  isSorted(field: string) {
    if (this.sortMode === 'single') {
      return (this.sortField && this.sortField === field);
    } else if (this.sortMode === 'multiple') {
      let sorted = false;
      if (this.multiSortMeta) {
        for (let i = 0; i < this.multiSortMeta.length; i++) {
          if (this.multiSortMeta[i].field === field) {
            sorted = true;
            break;
          }
        }
      }
      return sorted;
    }
  }

  handleRowClick(event) {
    const targetNode = (<HTMLElement>event.originalEvent.target).nodeName;
    if (targetNode === 'INPUT' || targetNode === 'BUTTON'
      || targetNode === 'A' || (this.domHandler.hasClass(event.originalEvent.target, 'ui-clickable'))) {
      return;
    }

    if (this.selectionMode) {
      this.preventSelectionSetterPropagation = true;

      const rowData = event.rowData;
      const selected = this.isSelected(rowData);
      const metaSelection = this.rowTouched ? false : this.metaKeySelection;
      const dataKeyValue = this.dataKey ? String(this.objectUtils.resolveFieldData(rowData, this.dataKey)) : null;
      this.anchorRowIndex = event.rowIndex;
      this.rangeRowIndex = event.rowIndex;

      if (metaSelection) {
        const metaKey = event.originalEvent.metaKey || event.originalEvent.ctrlKey;

        if (selected && metaKey) {
          this._selection = null;
          this.selectionKeys = {};
          this.selectionChange.emit(null);
          this.rowUnselect.emit({ originalEvent: event.originalEvent, data: rowData, type: 'row' });
        } else {
          this._selection = rowData;
          this.selectionChange.emit(rowData);
          if (dataKeyValue) {
            this.selectionKeys = {};
            this.selectionKeys[dataKeyValue] = 1;
          }
        }
      } else {

        if (selected) {
          this._selection = null;
          this.selectionKeys = {};
          this.selectionChange.emit(this.selection);
          this.rowUnselect.emit({ originalEvent: event.originalEvent, data: rowData, type: 'row' });
        } else {
          this._selection = rowData;
          this.selectionChange.emit(this.selection);
          this.rowUnselect.emit({ originalEvent: event.originalEvent, data: rowData, type: 'row', index: event.rowIndex });
          if (dataKeyValue) {
            this.selectionKeys = {};
            this.selectionKeys[dataKeyValue] = 1;
          }
        }

      }


      this.tableService.onSelectionChange();
    }

    this.rowTouched = false;
  }

  handleRowTouchEnd(event) {
    this.rowTouched = true;
  }


  toggleRowWithRadio(event: Event, rowData: any) {
    this.preventSelectionSetterPropagation = true;

    if (this.selection !== rowData) {
      this._selection = rowData;
      this.selectionChange.emit(this.selection);
      this.rowSelect.emit({ originalEvent: event, data: rowData, type: 'radiobutton' });

      if (this.dataKey) {
        this.selectionKeys = {};
        this.selectionKeys[String(this.objectUtils.resolveFieldData(rowData, this.dataKey))] = 1;
      }
    } else {
      this._selection = null;
      this.selectionChange.emit(this.selection);
      this.rowUnselect.emit({ originalEvent: event, data: rowData, type: 'radiobutton' });
    }

    this.tableService.onSelectionChange();
  }

  toggleRowWithCheckbox(event, rowData: any) {
    this.selection = this.selection || [];
    const selected = this.isSelected(rowData);
    const dataKeyValue = this.dataKey ? String(this.objectUtils.resolveFieldData(rowData, this.dataKey)) : null;
    this.preventSelectionSetterPropagation = true;

    if (selected) {
      const selectionIndex = this.findIndexInSelection(rowData);
      this._selection = this.selection.filter((val, i) => i !== selectionIndex);
      this.selectionChange.emit(this.selection);
      this.rowUnselect.emit({ originalEvent: event.originalEvent, data: rowData, type: 'checkbox' });
      if (dataKeyValue) {
        delete this.selectionKeys[dataKeyValue];
      }
    } else {
      this._selection = this.selection ? [...this.selection, rowData] : [rowData];
      this.selectionChange.emit(this.selection);
      this.rowSelect.emit({ originalEvent: event.originalEvent, data: rowData, type: 'checkbox' });
      if (dataKeyValue) {
        this.selectionKeys[dataKeyValue] = 1;
      }
    }

    this.tableService.onSelectionChange();
  }

  toggleRowsWithCheckbox(event: Event, check: boolean) {
    this._selection = check ? this.value.slice() : [];
    this.preventSelectionSetterPropagation = true;
    this.updateSelectionKeys();
    this.selectionChange.emit(this._selection);
    this.tableService.onSelectionChange();
    this.headerCheckboxToggle.emit({ originalEvent: event, checked: check });
  }




  isSelected = (rowData) => {
    if (rowData && this.selection) {
      if (this.dataKey) {
        return this.selectionKeys[this.objectUtils.resolveFieldData(rowData, this.dataKey)] !== undefined;
      } else {
        if (this.selection instanceof Array) {
          return this.findIndexInSelection(rowData) > -1;
        } else {
          return this.equals(rowData, this.selection);
        }
      }
    }

    return false;
  }

  findIndexInSelection(rowData: any) {
    let index = -1;
    if (this.selection && this.selection.length) {
      for (let i = 0; i < this.selection.length; i++) {
        if (this.equals(rowData, this.selection[i])) {
          index = i;
          break;
        }
      }
    }

    return index;
  }


  equals(data1, data2) {
    return this.compareSelectionBy === 'equals' ?
      (data1 === data2) : this.objectUtils.equals(data1, data2, this.dataKey);
  }

}

@Component({
  // tslint:disable-next-line
  selector: '[cpTableBody]',
  template: `
      <ng-container>
          <ng-template ngFor let-rowData let-rowIndex="index"
          [ngForOf]="dt.value">
              <ng-container *ngTemplateOutlet="template;
              context: {$implicit: rowData, rowIndex: dt.paginator
                ? (dt.first + rowIndex) : rowIndex, columns: columns}"></ng-container>
          </ng-template>
      </ng-container>
      <ng-container *ngIf="dt.isEmpty()">
          <ng-container *ngTemplateOutlet="dt.emptyMessageTemplate; context: {$implicit: columns}"></ng-container>
      </ng-container>
  `
})

export class TableBodyComponent {

  @Input() columns: any[];

  @Input() template: TemplateRef<any>;

  constructor(public dt: TableComponent) { }
}

@Component({
  // tslint:disable-next-line
  selector: '[cpTableFooter]',
  template: `
      <ng-container>
          <ng-template [ngIf]="dt.footerValue">
              <ng-container *ngTemplateOutlet="template; context: {$implicit: dt.footerValue}"></ng-container>
          </ng-template>
      </ng-container>
  `
})
export class TableFooterComponent {

  @Input() template: TemplateRef<any>;

  constructor(public dt: TableComponent) { }
}


@Directive({
  // tslint:disable-next-line
  selector: '[cpSelectableRowDblClick]',
  providers: [DomHandler],
})
export class SelectableRowDblClickDirective implements OnInit, OnDestroy {

  @Input('cpSelectableRowDblClick') data: any;

  @Input() cpSelectableRowIndex: number;

  @Input() cpSelectableRowDisabled: boolean;

  @HostBinding('class.state-highlight')
  selected: boolean;

  subscription: Subscription;

  constructor(public dt: TableComponent, public domHandler: DomHandler, public tableService: TableService) {
    if (this.isEnabled()) {
      this.subscription = this.dt.tableService.selectionSource$.subscribe(() => {
        this.selected = this.dt.isSelected(this.data);
      });
    }
  }

  ngOnInit() {
    if (this.isEnabled()) {
      this.selected = this.dt.isSelected(this.data);
    }
  }

  @HostListener('dblclick', ['$event'])
  onClick(event: Event) {
    if (this.isEnabled()) {
      this.dt.handleRowClick({
        originalEvent: event,
        rowData: this.data,
        rowIndex: this.cpSelectableRowIndex
      });
    }
  }

  isEnabled() {
    return this.cpSelectableRowDisabled !== true;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}


@Directive({
  // tslint:disable-next-line
  selector: '[cpSortableColumn]',
  providers: [DomHandler]
})
export class SortableColumnDirective implements OnInit, OnDestroy {

  @Input('cpSortableColumn') field: string;

  @Input()
  // @HostBinding('class.ui-state-highlight')
  pSortableColumnDisabled = false;

  // @HostBinding('class.ui-state-highlight')
  sorted: boolean;

  subscription: Subscription;

  constructor(public dt: TableComponent, public domHandler: DomHandler) {
    if (this.isEnabled()) {
      this.subscription = this.dt.tableService.sortSource$.subscribe(sortMeta => {
        this.updateSortState();
      });
    }
  }

  ngOnInit() {
    if (this.isEnabled()) {
      this.updateSortState();
    }
  }

  updateSortState() {
    this.sorted = this.dt.isSorted(this.field);
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.isEnabled()) {
      this.updateSortState();
      this.dt.sort({
        originalEvent: event,
        field: this.field
      });

      this.domHandler.clearSelection();
    }
  }

  isEnabled() {
    return this.pSortableColumnDisabled !== true;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}

@Component({
  // tslint:disable-next-line
  selector: 'cp-sort-icon',
  template: `
      <a href="#" (click)="onClick($event)" [attr.aria-label]="ariaText">
          <i class="sortable-column-icon fa"
          [ngClass]="{'fa-sort-up': sortOrder === 1,
          ' fa-sort-down': sortOrder === -1, 'fa-sort': sortOrder === 0}"></i>
      </a>
  `
})
export class SortIconComponent implements OnInit, OnDestroy {

  @Input() field: string;

  @Input() ariaLabel: string;

  @Input() ariaLabelDesc: string;

  @Input() ariaLabelAsc: string;

  subscription: Subscription;

  sortOrder: number;

  constructor(public dt: TableComponent) {
    this.subscription = this.dt.tableService.sortSource$.subscribe(sortMeta => {
      this.updateSortState();
    });
  }

  ngOnInit() {
    this.updateSortState();
  }

  onClick(event) {
    event.preventDefault();
  }

  updateSortState() {
    if (this.dt.sortMode === 'single') {
      this.sortOrder = this.dt.isSorted(this.field) ? this.dt.sortOrder : 0;
    } else if (this.dt.sortMode === 'multiple') {
      const sortMeta = this.dt.getSortMeta(this.field);
      this.sortOrder = sortMeta ? sortMeta.order : 0;
    }
  }

  get ariaText(): string {
    let text: string;

    switch (this.sortOrder) {
      case 1:
        text = this.ariaLabelAsc;
        break;

      case -1:
        text = this.ariaLabelDesc;
        break;

      default:
        text = this.ariaLabel;
        break;
    }

    return text;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}


@Component({
  // tslint:disable-next-line
  selector: 'cp-table-radio-button',
  template: `
      <div class="ui-radiobutton ui-widget" (click)="onClick($event)">
          <div class="ui-helper-hidden-accessible">
              <input type="radio" [checked]="checked" (focus)="onFocus()" (blur)="onBlur()" [disabled]="disabled">
          </div>
          <div #box [ngClass]="{'ui-radiobutton-box ui-widget ui-state-default':true,
              'ui-state-active':checked, 'ui-state-disabled':disabled}">
              <span class="ui-radiobutton-icon ui-clickable" [ngClass]="{'pi pi-circle-on':checked}"></span>
          </div>
      </div>
  `
})
export class TableRadioButtonComponent implements OnInit, OnDestroy {

  @Input() disabled: boolean;

  @Input() value: any;

  @ViewChild('box') boxViewChild: ElementRef;

  checked: boolean;

  subscription: Subscription;

  constructor(public dt: TableComponent, public domHandler: DomHandler, public tableService: TableService) {
    this.subscription = this.dt.tableService.selectionSource$.subscribe(() => {
      this.checked = this.dt.isSelected(this.value);
    });
  }

  ngOnInit() {
    this.checked = this.dt.isSelected(this.value);
  }

  onClick(event: Event) {
    if (!this.disabled) {
      this.dt.toggleRowWithRadio(event, this.value);
    }
    this.domHandler.clearSelection();
  }

  onFocus() {
    this.domHandler.addClass(this.boxViewChild.nativeElement, 'ui-state-focus');
  }

  onBlur() {
    this.domHandler.removeClass(this.boxViewChild.nativeElement, 'ui-state-focus');
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}

@Component({
  // tslint:disable-next-line
  selector: 'cp-table-checkbox',
  template: `
      <div class="ui-chkbox ui-widget" (click)="onClick($event)">
          <div class="ui-helper-hidden-accessible">
              <input type="checkbox" [checked]="checked" (focus)="onFocus()" (blur)="onBlur()" [disabled]="disabled">
          </div>
          <div #box [ngClass]="{'ui-chkbox-box ui-widget ui-state-default':true,
              'ui-state-active':checked, 'ui-state-disabled':disabled}">
              <span class="ui-chkbox-icon ui-clickable" [ngClass]="{'pi pi-check':checked}"></span>
          </div>
      </div>
  `
})
export class TableCheckboxComponent implements OnInit, OnDestroy {

  @Input() disabled: boolean;

  @Input() value: any;

  @ViewChild('box') boxViewChild: ElementRef;

  checked: boolean;

  subscription: Subscription;

  constructor(public dt: TableComponent, public domHandler: DomHandler, public tableService: TableService) {
    this.subscription = this.dt.tableService.selectionSource$.subscribe(() => {
      this.checked = this.dt.isSelected(this.value);
    });
  }

  ngOnInit() {
    this.checked = this.dt.isSelected(this.value);
  }

  onClick(event: Event) {
    if (!this.disabled) {
      this.dt.toggleRowWithCheckbox(event, this.value);
    }
    this.domHandler.clearSelection();
  }

  onFocus() {
    this.domHandler.addClass(this.boxViewChild.nativeElement, 'ui-state-focus');
  }

  onBlur() {
    this.domHandler.removeClass(this.boxViewChild.nativeElement, 'ui-state-focus');
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}

@Component({
  // tslint:disable-next-line
  selector: 'cp-table-header-checkbox',
  template: `
      <div class="ui-chkbox ui-widget" (click)="onClick($event, cb.checked)">
          <div class="ui-helper-hidden-accessible">
              <input #cb type="checkbox" [checked]="checked" (focus)="onFocus()" (blur)="onBlur()" [disabled]="isDisabled()">
          </div>
          <div #box [ngClass]="{'ui-chkbox-box ui-widget ui-state-default':true,
              'ui-state-active':checked, 'ui-state-disabled': isDisabled()}">
              <span class="ui-chkbox-icon ui-clickable" [ngClass]="{'pi pi-check':checked}"></span>
          </div>
      </div>
  `
})
export class TableHeaderCheckboxComponent implements OnInit, OnDestroy {

  @ViewChild('box') boxViewChild: ElementRef;

  @ViewChild('cb') checkbox: ElementRef;

  @Input() disabled: boolean;

  checked: boolean;

  selectionChangeSubscription: Subscription;

  valueChangeSubscription: Subscription;

  constructor(public dt: TableComponent,
    public domHandler: DomHandler,
    public tableService: TableService) {
    this.valueChangeSubscription = this.dt.tableService.valueSource$.subscribe(() => {
      this.checked = this.updateCheckedState();
    });

    this.selectionChangeSubscription = this.dt.tableService.selectionSource$.subscribe(() => {
      this.checked = this.updateCheckedState();
    });
  }

  ngOnInit() {
    this.checked = this.updateCheckedState();
  }

  onClick(event: Event, checked) {
    if (this.dt.value && this.dt.value.length > 0) {
      this.dt.toggleRowsWithCheckbox(event, checked);
    }

    this.domHandler.clearSelection();
  }

  onFocus() {
    this.domHandler.addClass(this.boxViewChild.nativeElement, 'ui-state-focus');
  }

  onBlur() {
    this.domHandler.removeClass(this.boxViewChild.nativeElement, 'ui-state-focus');
  }

  isDisabled() {
    return this.disabled || !this.dt.value || !this.dt.value.length;
  }

  ngOnDestroy() {
    if (this.selectionChangeSubscription) {
      this.selectionChangeSubscription.unsubscribe();
    }

    if (this.valueChangeSubscription) {
      this.valueChangeSubscription.unsubscribe();
    }
  }

  updateCheckedState() {
    const val = this.dt.value;
    return (val && val.length > 0 && this.dt.selection
      && this.dt.selection.length > 0 && this.dt.selection.length === val.length);
  }

}

@Injectable()
export class PaginationConfig {
  main: any = {
    maxSize: void 0,
    itemsPerPage: 10,
    boundaryLinks: false,
    directionLinks: true,
    // firstText: 'First',
    // previousText: 'Previous',
    // nextText: 'Next',
    // lastText: 'Last',
    // pageBtnClass: '',
    rotate: true
  };
  pager: any = {
    itemsPerPage: 15,
    // previousText: '« Previous',
    // nextText: 'Next »',
    // pageBtnClass: '',
    align: true
  };
}


export interface PageChangedEvent {
  itemsPerPage: number;
  page: number;
}

export const PAGINATION_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line
  useExisting: forwardRef(() => PaginationComponent),
  multi: true
};

@Component({
  // tslint:disable-next-line
  selector: 'cp-pagination',
  styleUrls: ['table.component.css'],
  template: `
  <ng-container *ngIf="paginator && totalItems > 0">
  <div [ngClass]="classPage">
    <button [ngClass]="{'is-disable ': noPrevious()||disabled}" class=" {{classPageBtn}} is-first"
    *ngIf="previousText && boundaryLinks"
      (click)="selectPage(1, $event)">
      <i class="c-icon icon-keyboard_arrow_left"></i><i class="c-icon icon-keyboard_arrow_left"></i>{{previousText}}</button>
    <button [ngClass]="{'is-disable ': noPrevious()||disabled}" class=" {{classPageBtn}} is-first"
    *ngIf="!previousText && boundaryLinks"
        (click)="selectPage(1, $event)">
        <i class="c-icon icon-keyboard_arrow_left"></i><i class="c-icon icon-keyboard_arrow_left"></i>1</button>
    <button  [ngClass]="{'is-disable ': noPrevious()||disabled}" class="{{classPageBtn}} is-before"
    *ngIf="directionLinks"
      (click)="selectPage(page - 1, $event)">
      <i class="c-icon icon-keyboard_arrow_left"></i>前</button>
    <ng-container *ngFor="let pg of pages; let i = index;">
      <button class="{{classPageBtn}}"  [ngClass]="{'is-active ': pg.active, 'is-disable': disabled}"
        (click)="selectPage(pg.number, $event)">{{pg.text}}</button>
    </ng-container>
    <button class="{{classPageBtn}} is-next" *ngIf="directionLinks"
    [ngClass]="{'is-disable ': noNext()||disabled}"
      (click)="selectPage(page + 1, $event)">次<i class="c-icon icon-keyboard_arrow_right"></i></button>
    <button class="{{classPageBtn}} is-last" *ngIf="lastText && boundaryLinks"
        (click)="selectPage(totalPages, $event)" [ngClass]="{'is-disable ': noNext()||disabled}">
        {{lastText}}<i class="c-icon icon-keyboard_arrow_right"></i><i class="c-icon icon-keyboard_arrow_right"></i></button>
    <button class="{{classPageBtn}} is-last" *ngIf="!lastText && boundaryLinks"
      (click)="selectPage(totalPages, $event)" [ngClass]="{'is-disable ': noNext()||disabled}">
      {{totalPages}} <i class="c-icon icon-keyboard_arrow_right"></i><i class="c-icon icon-keyboard_arrow_right"></i></button>

  </div>
    <div class="c-Pager--number u-mb-sm">
      <div class="c-Pager--count">{{totalItems}}</div>
      <div class="c-Pager--every">{{currPageItemsMin}}～{{currPageItemsMax}}件目を表示</div>
    </div>
  </ng-container>
    <ng-container *ngIf="btnTemplate">
    <ng-container *ngTemplateOutlet="btnTemplate"></ng-container>
    </ng-container>
  `,
  providers: [PAGINATION_CONTROL_VALUE_ACCESSOR]
})
export class PaginationComponent implements ControlValueAccessor, OnInit {

  config: any;
  @Input() paginator = true;
  /** if `true` aligns each link to the sides of pager */
  @Input() align: boolean;
  /** limit number for page links in pager */
  @Input() maxSize: number;
  /** if false first and last buttons will be hidden */
  @Input() boundaryLinks: boolean;
  /** if false previous and next buttons will be hidden */
  @Input() directionLinks: boolean;
  // labels
  /** first button text */
  // @Input() firstText: string;
  /** previous button text */
  @Input() previousText = '最初';
  /** next button text */
  // @Input() nextText: string;
  /** last button text */
  @Input() lastText = '最後';
  /** if true current page will in the middle of pages list */
  @Input() rotate: boolean;
  /** if true pagination component will be disabled */
  @Input() disabled: boolean;

  @Input() btnTemplate: TemplateRef<any>;

  /** fired when total pages count changes, $event:number equals to total pages count */
  @Output() numPages: EventEmitter<number> = new EventEmitter<number>();
  /** fired when page was changed, $event:{page, itemsPerPage} equals to object
   * with current page index and number of items per page
   */
  @Output()
  pageChanged = new EventEmitter<PageChangedEvent>();

  /** page class */
  @Input() classPage: string;

  /** page class */
  @Input() classPageBtn: string;

  /** maximum number of items per page. If value less than 1 will display all items on one page */
  @Input()
  get itemsPerPage(): number {
    return this._itemsPerPage;
  }

  set itemsPerPage(v: number) {
    this._itemsPerPage = v;
    this.totalPages = this.calculateTotalPages();
  }

  /** total number of items in all pages */
  @Input()
  get totalItems(): number {
    return this._totalItems;
  }

  set totalItems(v: number) {
    this._totalItems = v;
    this.totalPages = this.calculateTotalPages();
    this.currPageItemsMax = this.page === 1 ? this.itemsPerPage : this.page * this.itemsPerPage;
    this.currPageItemsMax = this.currPageItemsMax > this.totalItems ? this.totalItems : this.currPageItemsMax;
  }

  // @Input()
  // get count(): number {
  //   return this._count;
  // }

  // set count(v: number) {
  //   this._count = v;
  // }

  get totalPages(): number {
    return this._totalPages;
  }

  set totalPages(v: number) {
    this._totalPages = v;
    this.numPages.emit(v);
    this.togglePageAndTotal();
  }

  set page(value: number) {
    const _previous = this._page;
    this._page = value;
    this.togglePageAndTotal();
    this.changeDetection.markForCheck();

    if (_previous === this._page || typeof _previous === 'undefined') {
      return;
    }

    this.pageChanged.emit({
      page: this._page,
      itemsPerPage: this.itemsPerPage
    });
  }

  get page(): number {
    return this._page;
  }

  onChange: any = Function.prototype;
  onTouched: any = Function.prototype;

  // classMap: string;
  pages: any[];

  //
  protected currPageItemsMin = 1;
  protected currPageItemsMax: number;

  protected _itemsPerPage: number;
  protected _totalItems: number;
  protected _count: number;
  protected _totalPages: number;
  protected inited = false;
  protected _page = undefined;

  constructor(
    // public dt: TableComponent,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    paginationConfig: PaginationConfig,
    private changeDetection: ChangeDetectorRef
  ) {
    this.renderer = renderer;
    this.elementRef = elementRef;
    if (!this.config) {
      this.configureOptions(paginationConfig.main);
    }
  }

  togglePageAndTotal() {
    if (this._page > this._totalPages) {
      return;
    } else {
      this.pages = this.getPages(this.page, this.totalPages);
    }
  }

  configureOptions(config: any): void {
    this.config = Object.assign({}, config);
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      // this.classMap = this.elementRef.nativeElement.getAttribute('class') || '';
    }
    // watch for maxSize
    this.maxSize =
      typeof this.maxSize !== 'undefined' ? this.maxSize : this.config.maxSize;
    this.rotate =
      typeof this.rotate !== 'undefined' ? this.rotate : this.config.rotate;
    this.boundaryLinks =
      typeof this.boundaryLinks !== 'undefined'
        ? this.boundaryLinks
        : this.config.boundaryLinks;
    this.directionLinks =
      typeof this.directionLinks !== 'undefined'
        ? this.directionLinks
        : this.config.directionLinks;

    // base class
    this.itemsPerPage =
      typeof this.itemsPerPage !== 'undefined'
        ? this.itemsPerPage
        : this.config.itemsPerPage;
    this.totalPages = this.calculateTotalPages();
    // this class
    this.pages = this.getPages(this.page, this.totalPages);
    this.inited = true;
  }

  writeValue(value: number): void {
    this.page = value;
    this.pages = this.getPages(this.page, this.totalPages);
    this.currPageItemsMin = this.page === 1 ? 1 : (this.page - 1) * this.itemsPerPage + 1;
    this.currPageItemsMax = this.page === 1 ? this.itemsPerPage : this.page * this.itemsPerPage;
    this.currPageItemsMax = this.currPageItemsMax > this.totalItems ? this.totalItems : this.currPageItemsMax;
  }

  getText(key: string): string {
    return (this as any)[`${key}Text`] || this.config[`${key}Text`];
  }

  noPrevious(): boolean {
    return this.page === 1;
  }

  noNext(): boolean {
    return this.page === this.totalPages;
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  selectPage(page: number, event?: Event): void {
    this.currPageItemsMin = page === 1 ? 1 : (page - 1) * this.itemsPerPage + 1;
    this.currPageItemsMax = page === 1 ? this.itemsPerPage : page * this.itemsPerPage;
    this.currPageItemsMax = this.currPageItemsMax > this.totalItems ? this.totalItems : this.currPageItemsMax;
    if (event) {
      event.preventDefault();
    }

    if (!this.disabled) {
      if (event && event.target) {
        const target: any = event.target;
        target.blur();
      }
      this.writeValue(page);
      this.onChange(this.page);
    }
  }

  // Create page object used in template
  protected makePage(
    num: number,
    text: string,
    active: boolean
  ): { number: number; text: string; active: boolean } {
    return { text, number: num, active };
  }

  protected getPages(currentPage: number, totalPages: number): any[] {
    const pages: any[] = [];

    // Default page limits
    let startPage = 1;
    let endPage = totalPages;
    const isMaxSized =
      typeof this.maxSize !== 'undefined' && this.maxSize < totalPages;

    // recompute if maxSize
    if (isMaxSized) {
      if (this.rotate) {
        // Current page is displayed in the middle of the visible ones
        startPage = Math.max(currentPage - Math.floor(this.maxSize / 2), 1);
        endPage = startPage + this.maxSize - 1;

        // Adjust if limit is exceeded
        if (endPage > totalPages) {
          endPage = totalPages;
          startPage = endPage - this.maxSize + 1;
        }
      } else {
        // Visible pages are paginated with maxSize
        startPage =
          (Math.ceil(currentPage / this.maxSize) - 1) * this.maxSize + 1;

        // Adjust last page if limit is exceeded
        endPage = Math.min(startPage + this.maxSize - 1, totalPages);
      }
    }

    // Add page number links
    for (let num = startPage; num <= endPage; num++) {
      const page = this.makePage(num, num.toString(), num === currentPage);
      pages.push(page);
    }

    // Add links to move between page sets
    if (isMaxSized && !this.rotate) {
      if (startPage > 1) {
        const previousPageSet = this.makePage(startPage - 1, '...', false);
        pages.unshift(previousPageSet);
      }

      if (endPage < totalPages) {
        const nextPageSet = this.makePage(endPage + 1, '...', false);
        pages.push(nextPageSet);
      }
    }

    return pages;
  }

  // base class
  protected calculateTotalPages(): number {
    const totalPages =
      this.itemsPerPage < 1
        ? 1
        : Math.ceil(this.totalItems / this.itemsPerPage);

    return Math.max(totalPages || 0, 1);
  }
}
