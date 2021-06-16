/**
 *  date pipe
 *  @version 1.0
 *  @author
 */
import { Pipe, PipeTransform } from '@angular/core';
import { HelperService } from '../../helper.service';

@Pipe({
  name: 'formatDateBr'
})
export class FormatDatePipe implements PipeTransform {
  constructor(private helperService: HelperService) {}

  transform(value: any, exponent?: any): any {
    let ret = '';
    if (value) {
      ret = this.helperService.formatDate(value, exponent);
    }
    return ret;
  }
}
