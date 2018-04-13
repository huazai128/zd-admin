import { Routes, RouterModule } from '@angular/router';
import { ListsComponent } from './lists/lists.component';
import { DetailComponent } from './detail/detail.component';
import { KeywordsComponent } from './keywords/keywords.component';

const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'lists', component: ListsComponent },
  { path: 'detail/:_id', component: DetailComponent },
  { path: 'keywords', component: KeywordsComponent },

]

export const routing = RouterModule.forChild(routes);