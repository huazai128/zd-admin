import { Routes, RouterModule } from '@angular/router';
import { ListsComponent } from './lists/lists.component';
import { EditorComponet } from './editor/editor.component';

const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'lists', component: ListsComponent },
  { path: 'editor', component: EditorComponet },
  { path: 'editor/:_id', component: EditorComponet }
]

export const routing = RouterModule.forChild(routes);