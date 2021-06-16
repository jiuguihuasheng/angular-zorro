/**
 *  ルートコンポーネント機能のモジュールクラス
 *  @version 1.0
 *  @author
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { HttpClientModule } from '@angular/common/http';
import { CacheInputService } from './common/core-base/cache.input.service';
import { CacheListService } from './common/core-base/cache.list.service';
import { I18NService } from './common/core-services/i18n.service';
import { HelperService } from './shared/helper.service';
import { ModalsModule } from './common/core-components/modals/modals.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LinkModule } from './common/core-components/link/link.module';
import { CommponentEnvModule } from './common/core-components/component.env.module';
import { environment } from '../environments/environment';
import { restApi } from './common/restapi';
import { MenuClickModule } from './shared/menu-click/menu-click.module';
import { TableModule } from './common/core-components/table/table.module';
import { LoadingModule } from './common/core-components/lodaing/loading.module';
import { ValidService } from './common/core-services/valid.service';
import { AdminUserService } from './routes/admin-user/admin-user.service';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { ja_JP } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import ja from '@angular/common/locales/ja';

registerLocaleData(ja);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    I18NService,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LinkModule,
    CommponentEnvModule,
    CommponentEnvModule.forRoot(environment, restApi),
    TableModule,
    LoadingModule,
    MenuClickModule,
    HttpClientModule,
    LayoutModule,
    ModalsModule
  ],
  providers: [
    CacheInputService,
    CacheListService,
    HelperService,
    AdminUserService,
    ValidService,
    { provide: NZ_I18N, useValue: ja_JP }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
