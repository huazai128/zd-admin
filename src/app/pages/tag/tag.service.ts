import { Injectable } from '@angular/core';
import { HttpService } from '@core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TagService {

  constructor(private httpSer: HttpService) { }

  // 表单提交
  public addTag(data: any = {}): Observable<any> {
    return this.httpSer.post("tag", data);
  }

  // 根据id获取详情
  public getTagId(id: string): Observable<any> {
    return this.httpSer.get(`tag/${id}`);
  }

  // 修改表单
  public putTagId(data: any = {}): Observable<any> {
    return this.httpSer.put(`tag/${data._id}`, data)
  }

  // 获取数据集合
  public getLists(data: any = {}): Observable<any> {
    return this.httpSer.get("tag", data);
  }

  // 批量操作
  public moveState(params: any): Observable<any> {
    return this.httpSer.patch("tag", params);
  }

  // 删除
  public deleteTagId(id: string): Observable<any> {
    return this.httpSer.deleteId(`tag/${id}`);
  }
}