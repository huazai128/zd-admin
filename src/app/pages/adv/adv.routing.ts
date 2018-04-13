import { Routes, RouterModule } from "@angular/router";
import { AdvComponent } from "./adv.component";
import { AdvListComponent } from './list/list.component';
import { AdvEditorComponent } from './editor/editor.component';

const routes: Routes = [
  {
    path: '',
    component: AdvComponent,
    children:[
      { path:"",redirectTo:"lists",pathMatch:'full' },
      { path:"lists", component:AdvListComponent},
      { path:"editor",component:AdvEditorComponent},
      { path:"editor/:_id",component:AdvEditorComponent },
    ]
  }
]

export const routing = RouterModule.forChild(routes);