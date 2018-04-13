
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routing } from './login.routing';
import { LoginComponent } from './login.component';
import { NzMessageModule,NzFormModule,NzInputModule,NzButtonModule,NzCheckboxModule,NzGridModule } from 'ng-zorro-antd'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzMessageModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    NzGridModule,
    routing
  ],
  declarations: [
    LoginComponent
  ]
})
export class LoginModule {
}