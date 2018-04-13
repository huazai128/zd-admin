import { Injectable } from '@angular/core';
import { HttpService } from '@core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CommunityService {

  constructor(private httpSer: HttpService) { }

  // 根据id获取详情
  public getCommunityId(id: string): Observable<any> {
    return this.httpSer.get(`community/${id}`);
  }

  // 修改表单
  public putCommunityId(data: any = {}): Observable<any> {
    return this.httpSer.put(`community/${data._id}`, data)
  }

  // 获取数据集合
  public getLists(data: any = {}): Observable<any> {
    return this.httpSer.get("community", data);
  }

  // 批量操作
  public moveState(data: Array<string> = [], active: number): Observable<any> {
    return this.httpSer.patch("community", { ids: data, active: active });
  }

  // 获取评论
  public getComments(data: any = {}): Observable<any> {
    return this.httpSer.get("comment", data);
  }

  // 评论批量操
  public moveCommentState(data: Array<string> = [], active: number,id:string): Observable<any> {
    return this.httpSer.patch("comment", { ids: data, state: active,post_id:id });
  }
}