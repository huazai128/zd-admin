import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule, HttpService } from '@core';
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
  NzDatePickerModule,
  NzButtonModule,
  NzUploadModule,
  NzSelectModule,
  NzInputNumberModule,
} from 'ng-zorro-antd';
import { PipesModule } from '@pipes';
import { routing } from './project.routing';

import { ApplyListsComponent } from './apply/lists/lists.component';
import { ApllyDetailComponent } from './apply/detail/detail.component';
import { PlanListsComponent } from './plan/lists/lists.component';
import { PlanDetailComponent } from './plan/detail/detail.component';
import { PDetailComponent } from './apply/pDetail/detail.component';
import { PlatformListsComponent } from './apply/platform/lists.component';
import { TestComponent } from './apply/platform/component/test.component';

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
    NzDatePickerModule,
    NzUploadModule,
    NzSelectModule,
    NzInputNumberModule,
    FormsModule,
    ReactiveFormsModule,
    UEditorModule,
    PipesModule,
    routing,
  ],
  declarations: [
    ApplyListsComponent,
    PlanListsComponent,
    ApllyDetailComponent,
    PlanDetailComponent,
    PDetailComponent,
    PlatformListsComponent,
    TestComponent,
  ],
  providers: [HttpService]
})

export class ProjectModule {

}

