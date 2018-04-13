import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { distinct, concatAll, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Observable } from "rxjs/Observable";
import { AppService } from './app.servire';

@Component({
  selector: 'app-root',
  template: `
    <div class="main">
      <router-outlet></router-outlet>
    </div>
  `,
  providers: [AppService]
})

export class AppComponent {
  public optionIsInited: boolean = false;

  constructor(private _router: Router,private appService: AppService) {
    // 路由拦截
    this._router.events.pipe(
      map(() => {
        return of(this._router.url);
      }),
      concatAll(),
      distinct()
    ).subscribe((url:any) => {
      if (!Object.is(url, '/') && !Object.is(url, "/login")) {
        this.routerCheck(url);
      }
    })
  }

  ngOnInit(){
    this.routerCheck();
  }
  // 路由检测
  private routerCheck(url:string=""): void {
    if (!this.appService.tokenNotExpired()) {
      this._router.navigate(["/login"])
    } else if (!this.optionIsInited) {
      this._router.navigate(["/"])
      this.optionIsInited = true;
    }
  }
}
