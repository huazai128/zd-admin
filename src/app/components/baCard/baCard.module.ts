import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaCardComponent } from './baCard.component';
import { BaCardDirective } from './baCard.directive';
import { BaCardService } from './baCard.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    BaCardComponent,
    BaCardDirective,
  ],
  exports: [
    BaCardComponent,
    BaCardDirective
  ]
})

export class BaCardModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: BaCardModule,
      providers: [BaCardService]
    }
  }
}