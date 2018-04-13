import { Injectable } from '@angular/core';
import { API_ROOT } from '@config';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams,HttpRequest } from "@angular/common/http";
import { AppService } from '../../app.servire';
import { Observable } from "rxjs/Observable";
import { switchMap, retry, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/operator/catch';

@Injectable()
export class AdvListServier {

  private ApiUrl = `${API_ROOT}/adv`;

  constructor(private msg: NzMessageService, private httpClient: HttpClient) { }
  private headers = {
    headers: new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('id_token'))
  }

  // 获取数据成功
  private handleResponse = (res: any): Observable<any> => {
    if (res.code) {
      this.msg.success(res.message);
      return of(res);
    } else {
      this.msg.error(res.message);
      return of(res);
    }
  }

  // 请求失败
  private handleError = (err: HttpErrorResponse): Observable<any> => {
    if (err.error instanceof Error) {
      this.msg.error(err.message);
    } else {
      this.msg.error("请求失败,请重试!");
    }
    return of(err);
  }

  // 获取所有的广告位
  public getAdvs(data: any): Observable<any> {
    return this.httpClient.get(this.ApiUrl, { params: data }).pipe(
      switchMap(this.handleResponse),
      retry(3),
      catchError(this.handleError)
    )
  }

  // 批量删除
  public deleteAdvs(data: any): Observable<any> {
    return this.httpClient.delete(this.ApiUrl, { params: { body:data } ,headers:this.headers.headers}).pipe(
      switchMap(this.handleResponse),
      retry(3),
      catchError(this.handleError)
    )
  }

  //
}