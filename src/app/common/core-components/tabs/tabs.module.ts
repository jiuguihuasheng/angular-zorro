import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { NgTranscludeDirective } from './ng-transclude.directive';
import { TabHeadingDirective } from './tab-heading.directive';
import { TabDirective } from './tab.directive';
import { TabsetComponent } from './tabset.component';
import { TabsetConfig } from './tabset.config';

@NgModule({
  imports: [CommonModule],
  declarations: [
    NgTranscludeDirective,
    TabDirective,
    TabsetComponent,
    TabHeadingDirective
  ],
  exports: [
    TabDirective,
    TabsetComponent,
    TabHeadingDirective,
    NgTranscludeDirective
  ],
  providers: [
    TabDirective,
    TabsetComponent,
    TabHeadingDirective,
    NgTranscludeDirective,
    TabsetConfig
  ]
})
export class TabsModule { }
