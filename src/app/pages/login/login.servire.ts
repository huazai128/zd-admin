import { Injectable } from '@angular/core';
import { API_ROOT } from '@config';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient,HttpHeaders,HttpErrorResponse } from "@angular/common/http";
import { AppService } from '../../app.servire';
import { Observable } from "rxjs/Observable";
import { switchMap,retry,catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/operator/catch';

@Injectable()
export class LoginService{

  private ApiUrl = `${API_ROOT}/auth`;
  constructor(private msg:NzMessageService,private httpClient:HttpClient,private appSer:AppService){}

   // 获取数据成功
   private handleResponse = (res:any):Observable<any> => {
    if(res.code){
      this.msg.success(res.message);
      return of(res);
    }else{
      this.msg.error(res.message ? res.message : "登录失败");
      return of(res);
    }
  }
  // 请求失败
  private handleError = (err:HttpErrorResponse):Observable<any> => {
    if (err.error instanceof Error) {
      this.msg.error(err.message ? err.message : "登录失败");
    } else {
      this.msg.error("请求失败,请重试!");
    }
    return of(err);
  }
  
  public login(data){
    return this.httpClient.post(this.ApiUrl,data).pipe(
      switchMap(this.handleResponse),
      retry(3), 
      catchError(this.handleError)
    )
  }

  public logout(){
    localStorage.removeItem("id_token");
  }
  //
  public loggedIn(){
    return this.appSer.tokenNotExpired();
  }
}