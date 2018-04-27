import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from './https';
// import { NzMessageModule } from 'ng-zorro-antd';

const NG_SERVICES = [
  HttpService
]

export * from './https';

@NgModule({
  imports: [
    CommonModule,
  ],
  // providers:[]
})

export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        ...NG_SERVICES
      ]
    }
  }
}