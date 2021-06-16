/**
 *  object処理方法
 *  @version 1.0
 *  @author
 */
import { Injectable } from '@angular/core';


@Injectable()
export class ObjectUtils {

  public equals(obj1: any, obj2: any, field?: string): boolean {
    if (field) {
      return (this.resolveFieldData(obj1, field) === this.resolveFieldData(obj2, field));
    } else {
      return this.equalsByValue(obj1, obj2);
    }
  }

  public equalsByValue(obj1: any, obj2: any, visited?: any[]): boolean {
    if (obj1 == null && obj2 == null) {
      return true;
    }
    if (obj1 == null || obj2 == null) {
      return false;
    }

    if (obj1 === obj2) {
      return true;
    }

    if (typeof obj1 === 'object' && typeof obj2 === 'object') {
      if (visited) {
        if (visited.indexOf(obj1) !== -1) { return false; }
      } else {
        visited = [];
      }
      visited.push(obj1);

      // tslint:disable-next-line:forin
      for (const p in obj1) {
        if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) {
          return false;
        }

        switch (typeof (obj1[p])) {
          case 'object':
            if (!this.equalsByValue(obj1[p], obj2[p], visited)) { return false; }
            break;

          case 'function':
            if (typeof (obj2[p]) === 'undefined' || (p !== 'compare' && obj1[p].toString() !== obj2[p].toString())) { return false; }
            break;

          default:
            if (obj1[p] !== obj2[p]) {
              return false;
            }
            break;
        }
      }

      // tslint:disable-next-line:forin
      for (const p in obj2) {
        if (typeof (obj1[p]) === 'undefined') { return false; }
      }

      delete obj1._$visited;
      return true;
    }

    return false;
  }

  public resolveFieldData(data: any, field: any): any {
    if (data && field) {
      if (this.isFunction(field)) {
        return field(data);
      } else if (field.indexOf('.') === -1) {
        return data[field];
      } else {
        const fields: string[] = field.split('.');
        let value = data;
        for (let i = 0, len = fields.length; i < len; ++i) {
          if (value == null) {
            return null;
          }
          value = value[fields[i]];
        }
        return value;
      }
    } else {
      return null;
    }
  }

  private isFunction = (obj: any) => !!(obj && obj.constructor && obj.call && obj.apply);

  public filter(value: any[], fields: any[], filterValue: string) {
    const filteredItems: any[] = [];
    if (!fields || !filterValue) {
      return filteredItems;
    }
    if (value) {
      for (const item of value) {
        for (const field of fields) {
          if (String(this.resolveFieldData(item, field)).toLowerCase().indexOf(String(filterValue).toLowerCase()) > -1) {
            filteredItems.push(item);
            break;
          }
        }
      }
    }

    return filteredItems;
  }

  public reorderArray(value: any[], from: number, to: number) {
    let target: number;
    if (value && (from !== to)) {
      if (to >= value.length) {
        target = to - value.length;
        while ((target--) + 1) {
          value.push(undefined);
        }
      }
      value.splice(to, 0, value.splice(from, 1)[0]);
    }
  }

  public findIndexInList(item: any, list: any): number {
    let index = -1;

    if (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i] === item) {
          index = i;
          break;
        }
      }
    }
    return index;
  }

  public generateSelectItems(val: any[], field: string): any[] {
    let selectItems: any[];
    if (val && val.length) {
      selectItems = [];
      for (const item of val) {
        selectItems.push({ label: this.resolveFieldData(item, field), value: item });
      }
    }

    return selectItems;
  }
}
