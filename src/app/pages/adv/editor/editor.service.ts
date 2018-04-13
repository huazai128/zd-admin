import { Injectable } from '@angular/core';
import { API_ROOT } from '@config';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { switchMap, retry, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/operator/catch';


@Injectable()
export class AdvEditorServier {

  private ApiUrl = `${API_ROOT}/adv`;

  constructor(private msg: NzMessageService, private httpClient: HttpClient) { }
  private headers = {
    headers: new HttpHeaders().set('Authorization', 'Bearer '+localStorage.getItem('id_token')) 
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

  // 新增广告位
  public addAdv(data):Observable<any>{
    return this.httpClient.post(this.ApiUrl,data,this.headers).pipe(
      switchMap(this.handleResponse),
      retry(3),
      catchError(this.handleError)
    )
  }
  // 修改广告位
  public putAdv(data):Observable<any>{
    return this.httpClient.put(`${this.ApiUrl}/${data._id}`,data,this.headers).pipe(
      switchMap(this.handleResponse),
      retry(3),
      catchError(this.handleError)
    )
  }
  // 获取当前ID下的广告位
  public getAdv(id:string):Observable<any>{
    return this.httpClient.get(`${ this.ApiUrl }/${ id }`,this.headers).pipe(
      switchMap(this.handleResponse),
      retry(3),
      catchError(this.handleError)
    )
  }
}