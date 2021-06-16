/**
 *  多言語処理機能のサービスクラス
 *  @version 1.0
 *  @author
 */
import { Injectable, NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

import { DICTIONARY } from 'src/resources/i18n';
import { UserInfoService } from './user-info.service';


export class TranslateDictionaryLoader implements TranslateLoader {
  constructor() { }

  public getTranslation(lang: string): Observable<any> {
    return of(DICTIONARY[lang] || {});
  }
}

export function createTranslateLoader() {
  return new TranslateDictionaryLoader();
}

const translationOptions = {
  loader: {
    provide: TranslateLoader,
    useFactory: (createTranslateLoader)
  }
};

@NgModule({
  imports: [TranslateModule.forRoot(translationOptions)],
  exports: [TranslateModule],
  providers: [TranslateService]
})

@Injectable()
export class I18NService {
  constructor(
    private userInfoService: UserInfoService,
    private translate: TranslateService) {
    translate.addLangs(['ja']);
    translate.setDefaultLang('ja');
    translate.use('ja');
  }

  getResource(key: string): Observable<string | any> {
    return this.translate.get(key);
  }

  getResourceSync(key: string): string|Object {
    return this.translate.instant(key);
  }
}
