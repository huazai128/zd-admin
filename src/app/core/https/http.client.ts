import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams, HttpRequest } from '@angular/common/http';
import { API_ROOT } from '@config';
import { NzMessageService } from 'ng-zorro-antd';
import { switchMap, retry, catchError } from 'rxjs/operators';
import { Observable } from "rxjs/Observable";
import { of } from 'rxjs/observable/of';

@Injectable()
export class HttpService {

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

  // get请求
  public get(url: string, parmas: any = {}): Observable<any> {
    return this.httpClient.get(`${API_ROOT}/${url}`, { params: parmas }).pipe(
      switchMap(this.handleResponse),
      retry(3),
      catchError(this.handleError)
    )
  }

  // post 请求
  public post(url: string, data: any = {}): Observable<any> {
    return this.httpClient.post(`${API_ROOT}/${url}`, data, this.headers).pipe(
      switchMap(this.handleResponse),
      retry(3),
      catchError(this.handleError)
    )
  }

  // put 请求
  public put(url: string, data: any = {}): Observable<any> {
    return this.httpClient.put(`${API_ROOT}/${url}`, data, this.headers).pipe(
      switchMap(this.handleResponse),
      retry(3),
      catchError(this.handleError)
    )
  }

  // delete 请求
  public delete(url: string, parmas: HttpParams): Observable<any> {
    return this.httpClient.delete(`${API_ROOT}/${url}`, Object.assign({ parmas: parmas }, this.headers)).pipe(
      switchMap(this.handleResponse),
      retry(3),
      catchError(this.handleError)
    )
  }

  // patch 请求
  public patch(url: string, parmas: any = {}): Observable<any> {
    return this.httpClient.patch(`${API_ROOT}/${url}`, parmas, this.headers).pipe(
      switchMap(this.handleResponse),
      retry(3),
      catchError(this.handleError)
    )
  }

  public deleteId(url:string): Observable<any> {
    return this.httpClient.delete(`${API_ROOT}/${url}`, this.headers).pipe(
      switchMap(this.handleResponse),
      retry(3),
      catchError(this.handleError)
    )
  }

}