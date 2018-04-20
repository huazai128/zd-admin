import { Routes, RouterModule } from '@angular/router';
import { OrdinaryComponent } from './ordinary/ordinary.component';
import { TestComponent } from './test/test.component';
import { ProhibitComponent } from './prohibit/prohibit.component';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
  { path: '', redirectTo: 'ordinary', pathMatch: 'full' },
  { path: 'ordinary', component: OrdinaryComponent},
  { path: 'test', component: TestComponent},
  { path: 'prohibit', component: ProhibitComponent},
  { path: 'auth', component: AuthComponent},
]

export const routing = RouterModule.forChild(routes);