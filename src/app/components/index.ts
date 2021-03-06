
import { NgModule, ModuleWithProviders } from '@angular/core';
import { BaCardModule } from './baCard/baCard.module';
import { UEditorModule } from './baUEdtior/ueditor.module';
export * from './baCard';
export * from './baUEdtior';

const MODULES = [
  BaCardModule,
  UEditorModule
]

@NgModule({
  imports: [
    BaCardModule.forRoot(),
    UEditorModule.forRoot({
      path: './assets/ueditor/',
      options: {
        themePath: '/assets/ueditor/themes/'
      }
    }),
  ],
  exports: [...MODULES]
})

export class AlineModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AlineModule,
      providers: []
    }
  }
}




































































































































































































































































































































































