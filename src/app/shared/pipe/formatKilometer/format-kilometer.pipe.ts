/**
 *  KM pipe
 *  @version 1.0
 *  @author
 */
import { Pipe, PipeTransform } from '@angular/core';
import { HelperService } from '../../helper.service';

@Pipe({
  name: 'formatKM'
})
export class FormatKilometer implements PipeTransform {
  constructor(private helperService: HelperService) {}

  transform(value: any): string {
    let ret = '';
    if (value) {
      ret = this.helperService.toKilometer(value);
    }
    return ret;
  }
}
