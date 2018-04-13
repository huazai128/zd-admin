import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule,NzLayoutModule,NzModalModule ,NzTableModule,NzCheckboxModule,NzInputModule,NzGridModule,NzButtonModule,NzUploadModule,NzSelectModule,NzInputNumberModule,NzMessageModule } from 'ng-zorro-antd';
import { HttpClientModule } from '@angular/common/http';
import { routing } from './adv.routing';
import { BaCardModule } from '@components';
import { PipesModule } from '@pipes'

import { AdvComponent } from './adv.component';
import { AdvEditorComponent } from './editor/editor.component';
import { AdvListComponent } from './list/list.component';


@NgModule({
  imports:[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzSelectModule,
    BaCardModule,
    NzCheckboxModule,
    NzTableModule,
    NzLayoutModule,
    NzInputModule,
    HttpClientModule,
    NzGridModule,
    NzFormModule,
    NzUploadModule,
    NzMessageModule,
    PipesModule,
    NzModalModule,
    NzSelectModule,
    NzInputNumberModule,
    routing
  ],
  declarations:[
    AdvComponent,
    AdvListComponent,
    AdvEditorComponent,
  ],
})

export class AdvModule{

}