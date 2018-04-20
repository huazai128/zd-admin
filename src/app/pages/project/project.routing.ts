import { Routes, RouterModule } from '@angular/router';
import { ApplyListsComponent } from './apply/lists/lists.component';
import { ApllyDetailComponent } from './apply/detail/detail.component';
import { PlanListsComponent } from './plan/lists/lists.component';
import { PlanDetailComponent } from './plan/detail/detail.component';
import { PDetailComponent } from './apply/pDetail/detail.component';
import { PlatformListsComponent } from './apply/platform/lists.component';

const routes: Routes = [
  { path: '', redirectTo: 'apply', pathMatch: 'full' },
  { path: 'apply', component: ApplyListsComponent,},
  { path: 'detail/:_id', component: ApllyDetailComponent, },
  { path: 'plan', component: PlanListsComponent, },
  { path: 'p_detail', component: PDetailComponent,  },
  { path: 'p_detail/:_id', component: PDetailComponent, },
  { path: 'platform', component: PlatformListsComponent,  },
  
]

export const routing = RouterModule.forChild(routes);