import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PagesModule } from './pages/pages.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AppComponent } from './app.component';
import { AlineModule } from '@components';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule  } from '@angular/common/http';
import { HighlightJsModule } from 'ngx-highlight-js';
import { CommonModule } from '@angular/common';
export function tokenGetter(): string { return localStorage.getItem('id_token'); }

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    PagesModule,
    BrowserAnimationsModule,
    AlineModule.forRoot(),
    CommonModule,
    NgZorroAntdModule.forRoot(),
    HttpClientModule,
    HighlightJsModule,
    JwtModule.forRoot({
      config: {
        headerName: 'Authorization', // 标题名称
        authScheme:"Bearer",  // 授权方案
        tokenGetter : tokenGetter, // 获取令牌，并返回
        throwNoTokenError: false, // 是否抛出异常
        skipWhenExpired:false,  //
        whitelistedDomains: ['localhost:3000'] //只允许你身份验证的请求只能发送到您认可和信任的域
      }
    }),
  ],
  declarations: [
    AppComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
