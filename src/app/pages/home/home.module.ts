import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HomeComponent } from './home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule,NzLayoutModule,NzDatePickerModule,NzCheckboxModule,NzModalModule,NzTableModule,NzInputModule,NzGridModule,NzButtonModule,NzUploadModule,NzSelectModule,NzInputNumberModule } from 'ng-zorro-antd';
import { routing } from './home.routing';
import { BaCardModule,UEditorModule } from '@components';
import { ListComponent } from './list/list.component';
import { EditorComponent } from './editor/editor.component';
import { PipesModule } from '@pipes';

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
    UEditorModule,
    NzModalModule,
    NzDatePickerModule,
    PipesModule,
    routing
  ],
  declarations:[
    HomeComponent,
    EditorComponent,
    ListComponent,
  ]
})

export class HomeModule{

}