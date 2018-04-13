import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule, HttpService } from '@core';
import { routing } from './community.routing';
import { BaCardModule, UEditorModule } from '@components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NzFormModule,
  NzLayoutModule,
  NzCheckboxModule,
  NzModalModule,
  NzTableModule,
  NzInputModule,
  NzGridModule,
  NzButtonModule,
  NzUploadModule,
  NzSelectModule,
  NzInputNumberModule,
} from 'ng-zorro-antd';
import { PipesModule } from '@pipes';

import { CommunityComponent } from './community.component';
import { ListsComponent } from './lists/lists.component';
import { DetailComponent } from './detail/detail.component';
import { KeywordsComponent } from './keywords/keywords.component';
import { CommunityService } from './community.service';
import { KyListsComponent } from './keywords/lists/lists.component';
import { EditorComponent } from './keywords/editor/editor.copmonent';
import { CommnetsComponent } from './detail/lists/lists.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    BaCardModule,
    NzFormModule,
    NzLayoutModule,
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
    routing,
  ],
  declarations: [
    CommunityComponent,
    ListsComponent,
    DetailComponent,
    KeywordsComponent,
    KyListsComponent,
    EditorComponent,
    CommnetsComponent,
  ],
  providers: [HttpService, CommunityService]
})

export class CommunityModule {

}

