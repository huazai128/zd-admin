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
  NzSelectModule,
  NzRadioModule,
  NzInputNumberModule,
} from 'ng-zorro-antd';
import { PipesModule } from '@pipes';
import { routing } from './user.routing';
import { UserService } from './user.service';

import { OrdinaryComponent } from './ordinary/ordinary.component';
import { TestComponent } from './test/test.component';
import { ProhibitComponent } from './prohibit/prohibit.component';
import { AuthComponent } from './auth/auth.component';

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
    NzSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputNumberModule,
    PipesModule,
    NzRadioModule,
    routing,
  ],
  declarations: [
    OrdinaryComponent,
    TestComponent,
    ProhibitComponent,
    AuthComponent,
  ],
  providers: [HttpService,UserService]
})

export class UserModule {

}

