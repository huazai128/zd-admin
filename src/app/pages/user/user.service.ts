import { Injectable } from '@angular/core';
import { HttpService } from '@core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {

  constructor(private httpSer: HttpService) { }

  // 根据id获取详情
  public getUserId(id: string): Observable<any> {
    return this.httpSer.get(`auth/${id}`);
  }

  // 获取数据集合
  public getLists(data: any = {}): Observable<any> {
    return this.httpSer.get("auth", data);
  }

  // 新增
  public addApply(data: any = {}): Observable<any> {
    return this.httpSer.post("auth", data);
  }

  // 批量操作
  public moveState(data: Array<string> = [], active: number): Observable<any> {
    return this.httpSer.patch("auth", { ids: data, state: active });
  }

  // 修改单个文件
  public putApplyId(data: any = {}): Observable<any> {
    return this.httpSer.put(`auth/${data._id}`, data);
  }
}