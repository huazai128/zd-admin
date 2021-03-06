import { Routes, RouterModule } from "@angular/router";
import { PagesComponent } from "./pages.component";

const routes: Routes = [
  {
    path: "login",
    loadChildren: "app/pages/login/login.module#LoginModule"
  },
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: "", redirectTo: 'adv', pathMatch: 'full' },
      { path: "home", loadChildren: "app/pages/home/home.module#HomeModule" },
      { path: "adv", loadChildren: "app/pages/adv/adv.module#AdvModule" },
      { path: "forum", loadChildren: "app/pages/forum/forum.module#ForumModule" },
      { path: "tag", loadChildren: "app/pages/tag/tag.module#TagModule" },
      { path: "community", loadChildren: "app/pages/community/community.module#CommunityModule" },
      { path: "project", loadChildren: "app/pages/project/project.module#ProjectModule" },
      { path: "user", loadChildren: "app/pages/user/user.module#UserModule" },
    ]
  },
]

export const routing = RouterModule.forRoot(routes, { useHash: true });