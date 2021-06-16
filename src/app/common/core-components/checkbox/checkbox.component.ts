/**
 *  チェックボックス
 *  @version 1.0
 *  @author
 */
import {
  Component,
  OnInit,
  Input,
  Output,
  forwardRef,
  ElementRef,
  EventEmitter,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AuthInfoService } from '../../core-services/auth-info.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cp-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CheckboxComponent), multi: true },
  ]
})

export class CheckboxComponent implements OnInit {
  @Input() inputClass?: string;
  @Input() labelClass?: string;
  @Input() label = '';
  @Input() disabled: boolean;
  @Input() key: string;

  // ボタンの役割
  @Input() authRole: any[];

  // checkboxChangeは最新の値が得られない。
  // 最新値取得用(change)またはngModelChange
  @Output() checkboxChange: EventEmitter<any> = new EventEmitter<any>();

  _value: boolean;
  validRole = true;

  constructor(private el: ElementRef,
    private authInfoService: AuthInfoService) { }

  ngOnInit() {
    this.validRole = this.authInfoService.authsCheck(this.authRole);
  }

  toggle(key) {
    if (this.disabled) { return; }
    this.checkboxChange.emit(key);
  }

  set value(v) {
    this._value = v;
    this.onChangeCallback(this._value);
    this.el.nativeElement.value = v;
  }

  writeValue(value: any): void {
    this._value = value;
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
