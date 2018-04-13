import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home.component";
import { ListComponent } from './list/list.component';
import { EditorComponent } from './editor/editor.component'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children:[
      { path:"",redirectTo:"lists",pathMatch:'full' },
      { path:"lists",component:ListComponent },
      { path:"editor",component:EditorComponent },
      { path:"editor/:_id",component:EditorComponent },
    ]
  }
]

export const routing = RouterModule.forChild(routes);