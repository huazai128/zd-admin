import { Injectable } from '@angular/core';
import { HttpService } from '@core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

  constructor(private httpSer: HttpService) { }

  // 根据id获取详情
  public getUserId(id: string): Observable<any> {
    return this.httpSer.get(`account/${id}`);
  }

  // 获取数据集合
  public getLists(data: any = {}): Observable<any> {
    return this.httpSer.get("account", data);
  }

  // 注册
  public addUser(data: any = {}): Observable<any> {
    return this.httpSer.post("account_post", data);
  }

  // 修改单个文件
  public putUserId(data: any = {}): Observable<any> {
    return this.httpSer.put(`account/${data._id}`, data);
  }
}