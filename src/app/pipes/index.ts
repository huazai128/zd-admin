import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StringStr } from './stringStr';
import { DateStr } from './date';


const PIPES = [
  StringStr,
  DateStr
]

@NgModule({
  imports:[

  ],
  declarations:[
    ...PIPES
  ],
  exports:[
    ...PIPES
  ]
})

export class PipesModule{

}