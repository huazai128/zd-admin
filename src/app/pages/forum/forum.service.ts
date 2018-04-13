import { Injectable } from '@angular/core';
import { HttpService } from '@core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ForumService {

  constructor(private httpSer: HttpService) { }

  // 表单提交
  public addForum(data: any = {}): Observable<any> {
    return this.httpSer.post("forum", data);
  }

  // 根据id获取详情
  public getForumId(id: string): Observable<any> {
    return this.httpSer.get(`forum/${id}`);
  }

  // 修改表单
  public putForumId(data: any = {}): Observable<any> {
    return this.httpSer.put(`forum/${data._id}`, data)
  }

  // 获取数据集合
  public getLists(data: any = {}): Observable<any> {
    return this.httpSer.get("forum", data);
  }

  // 批量操作
  public moveState(data: Array<string> = [], active: number): Observable<any> {
    return this.httpSer.patch("forum", { ids: data, active: active });
  }
  
  // 获取tag标签
  public getTags(data: any = {}): Observable<any> {
    return this.httpSer.get("tag", data);
  }
}