/**
 *  プルダウン
 *  @version 1.0
 *  @author
 */
import { Component, OnInit, Output, Input, EventEmitter, ElementRef, ContentChild, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  // tslint:disable-next-line
  selector: 'cp-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectComponent), multi: true },
  ]
})
export class SelectComponent implements OnInit {

  @ContentChild('optionTemplate') optionTemplate: any;

  @Input() selectClass: string;

  @Input() disabled: string;

  @Input() datas?: any;

  _value: string;

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
  }

  set value(v) {
    this._value = v;
    this.onChangeCallback(this._value);
    this.el.nativeElement.value = v;
  }

  writeValue(value: any): void {
    this._value = value;
    this.el.nativeElement.value = value;
  }

  get value() {
    return this._value;
  }

  private onChangeCallback = (_: any) => { };

  private onTouchedCallback = () => { };

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }
}
