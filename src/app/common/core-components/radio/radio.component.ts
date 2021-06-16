/**
 *  ラジオボタン
 *  @version 1.0
 *  @author
 */
import {
  Component,
  OnInit,
  Input,
  Output,
  ElementRef,
  forwardRef,
  EventEmitter,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AuthInfoService } from '../../core-services/auth-info.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cp-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RadioComponent), multi: true },
  ]
})

export class RadioComponent implements OnInit {
  @Input() inputClass?: string;
  @Input() labelClass?: string;
  @Input() label?: string;
  @Input() radioName: string;
  @Input() disabled: boolean;
  @Input() key: string;
  @Input() dataValue?: string;

  /**
   * ボタンの役割
   */
  @Input() authRole: any[];

  @Output() radioChange: EventEmitter<any> = new EventEmitter<any>();
  _value: string;
  validRole = true;

  constructor(private el: ElementRef,
    private authInfoService: AuthInfoService) { }

  ngOnInit() {
    this.dataValue = this.dataValue ? this.dataValue : this.key;
    this.validRole = this.authInfoService.authsCheck(this.authRole);
  }

  toggle(v) {
    this.radioChange.emit(v);
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
