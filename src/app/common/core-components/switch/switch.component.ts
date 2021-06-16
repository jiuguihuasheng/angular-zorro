/**
 *  スイッチ
 *  @version 1.0
 *  @author
 */
import {
  Component,
  Input,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cp-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SwitchComponent),
    multi: true
  }]
})

export class SwitchComponent implements ControlValueAccessor {
  @Input() divClass?: string;
  @Input() inputClass?: string;
  @Input() labelClass?: string;
  checked: boolean;
  change: Function = (value: boolean) => {};

  constructor() { }

  toggle() {
    this.checked = !this.checked;
    this.change(this.checked);
  }

  writeValue(val: boolean): void {
    this.checked = val;
  }

  registerOnChange(fn: Function): void {
    this.change = fn;
  }

  registerOnTouched(fn: Function): void {
  }

}
