import { Component,ViewEncapsulation } from "@angular/core";
import { LoginService } from './login/login.servire';
import { Router } from "@angular/router";

@Component({
  selector: "app-pages",
  templateUrl: "./pages.html",
  styleUrls: ['./pages.scss'],
  encapsulation:ViewEncapsulation.None,
  providers:[LoginService]
})

export class PagesComponent {
  isCollapsed = false;

  constructor(private loginSer:LoginService,private router:Router){
    
  }
  public logout(){
    this.loginSer.logout();
    this.router.navigate(['login'])
  }
}