import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { routing } from './pages.routing';
import { PagesComponent } from './pages.component';
import { NzLayoutModule,NzSliderModule,NzTableModule,NzBreadCrumbModule,NzMenuModule } from 'ng-zorro-antd';

@NgModule({
  imports:[
    CommonModule,
    NzLayoutModule,
    NzSliderModule,
    NzTableModule,
    NzBreadCrumbModule,
    NzMenuModule,
    routing
  ],
  declarations:[
    PagesComponent,
  ],
})
export  class PagesModule{

}