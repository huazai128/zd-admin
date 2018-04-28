import { Component, ViewEncapsulation } from "@angular/core";
import { LoginService } from './login/login.servire';
import { Router } from "@angular/router";
import { GlobalSeriver } from '../global.service';

@Component({
  selector: "app-pages",
  templateUrl: "./pages.html",
  styleUrls: ['./pages.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [LoginService, GlobalSeriver]
})

export class PagesComponent {
  isCollapsed = false;

  public routeData = [
    {
      title: '内容管理',
      icon: 'anticon-mail',
      child: [
        { path: '/adv/lists', title: '广告位管理' },
        { path: '/home/lists', title: '新闻管理' },
        { path: '/forum/lists', title: '论坛管理' },
        { path: '/tag', title: '类型标签管理' },
      ]
    },
    {
      title: '社区管理',
      icon: 'anticon-appstore',
      child: [
        { path: '/community/lists', title: '帖子管理' },
        { path: '/community/keywords', title: '屏蔽关键字' },
      ]
    },
    {
      title: '内容管理',
      icon: 'anticon-setting',
      child: [
        { path: '/project/apply', title: '测试申请' },
        { path: '/project/plan', title: '解决方案' },
        { path: '/project/platform', title: '众测平台' },
      ]
    },
    {
      title: '用户管理',
      icon: 'anticon-setting',
      child: [
        { path: '/user/ordinary', title: '普通用户' },
        { path: '/user/test', title: '测试开发者' },
        { path: '/user/prohibit', title: '封禁用户' },
      ]
    },
    {
      title: '系统设置',
      icon: 'anticon-setting',
      child: [
        { path: '/user/auth', title: '账号设置' },
      ]
    }
  ]
  constructor(
    private loginSer: LoginService,
    private _state: GlobalSeriver,
    private router: Router) {
  }
  ngOnInit() {
    let power = localStorage.getItem("power").split(',');
    this.routeData = this.routeData.filter((item, index) =>  power.includes(String(index)));
  }
  public logout() {
    this.loginSer.logout();
    this.router.navigate(['login'])
  }
}