import { Routes, RouterModule } from '@angular/router';
import { ApplyListsComponent } from './apply/lists/lists.component';
import { ApllyDetailComponent } from './apply/detail/detail.component';
import { PlanListsComponent } from './plan/lists/lists.component';
import { PlanDetailComponent } from './plan/detail/detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'apply', pathMatch: 'full' },
  { path: 'apply', component: ApplyListsComponent, },
  { path: 'detail/:_id', component: ApllyDetailComponent, },
  { path: 'plan', component: PlanListsComponent, },
  { path: 'p_detail/:_id', component: PlanDetailComponent, },
]

export const routing = RouterModule.forChild(routes);