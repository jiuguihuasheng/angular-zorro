/**
 *  期間選択 Directive
 *  @version 1.0
 *  @author
 */
import { NgModule, Directive, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Directive({
    selector: '[pTemplate]',
    host: {
    }
})
export class PrimeTemplateDirective {

    @Input() type: string;

    @Input('pTemplate') name: string;

    constructor(public template: TemplateRef<any>) { }

    getType(): string {
        return this.name;
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [PrimeTemplateDirective],
    declarations: [PrimeTemplateDirective]
})
export class SharedModule { }
