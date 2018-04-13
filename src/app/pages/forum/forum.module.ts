import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule,HttpService } from '@core';
import { routing } from './forum.routing';
import { BaCardModule, UEditorModule } from '@components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NzFormModule,
  NzLayoutModule,
  NzDatePickerModule,
  NzCheckboxModule,
  NzModalModule,
  NzTableModule,
  NzInputModule,
  NzGridModule,
  NzButtonModule,
  NzUploadModule,
  NzSelectModule,
  NzInputNumberModule
} from 'ng-zorro-antd';
import { PipesModule } from '@pipes';

import { ForumComponent } from './forum.componet';
import { ListsComponent } from './lists/lists.component';
import { EditorComponet } from './editor/editor.component';


@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    BaCardModule,
    NzFormModule,
    NzLayoutModule,
    NzDatePickerModule,
    NzCheckboxModule,
    NzModalModule,
    NzTableModule,
    NzInputModule,
    NzGridModule,
    NzButtonModule,
    NzUploadModule,
    NzSelectModule,
    NzInputNumberModule,
    UEditorModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    routing
  ],
  declarations: [
    ForumComponent,
    ListsComponent,
    EditorComponet
  ],
  providers:[HttpService]
})

export class ForumModule {

}

