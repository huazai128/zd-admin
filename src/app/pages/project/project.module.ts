import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule, HttpService } from '@core';
import { BaCardModule } from '@components';
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

import { ProjectComponent } from './project.component';
import { ApplyListsComponent } from './apply/lists/lists.component';
import { ApllyDetailComponent } from './apply/detail/detail.component';
import { PlanListsComponent } from './plan/lists/lists.component';
import { PlanDetailComponent } from './plan/detail/detail.component';

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
    PipesModule,
    routing,
  ],
  declarations: [
    ProjectComponent,
    ApplyListsComponent,
    PlanListsComponent,
    ApllyDetailComponent,
    PlanDetailComponent,
  ],
  providers: [HttpService]
})

export class ProjectModule {

}

