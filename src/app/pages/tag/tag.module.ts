import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule,
  NzLayoutModule,
  NzCheckboxModule,
  NzModalModule,
  NzTableModule,
  NzInputModule,
  NzGridModule,
  NzButtonModule,
  NzUploadModule,
  NzSelectModule,
  NzInputNumberModule } from 'ng-zorro-antd';
import { routing } from './tag.routing';
import { BaCardModule } from '@components';
import { PipesModule } from '@pipes';
import { CoreModule,HttpService } from '@core';

import { TagComponent } from './tag.component';
import { ListsComponent } from './lists/lists.components';
import { EditorComponent } from './editor/editor.component';
 
@NgModule({
  imports:[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BaCardModule,
    NzFormModule,
    NzLayoutModule,
    NzCheckboxModule,
    NzTableModule,
    NzInputModule,
    NzGridModule,
    NzButtonModule,
    NzUploadModule,
    NzSelectModule,
    NzInputNumberModule,
    NzModalModule,
    PipesModule,
    CoreModule,
    routing
  ],
  declarations:[
    TagComponent,
    ListsComponent,
    EditorComponent
  ],
  providers:[HttpService]
})

export class TagModule{

}