import { Injectable } from '@angular/core';
import { HttpService } from '@core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class KeywordsSerive{

  constructor(private httpSer:HttpService){}

  // 表单提交
  public addKy(data: any = {}): Observable<any> {
    return this.httpSer.post("ky", data);
  }

  // 根据id获取详情
  public getKyId(id: string): Observable<any> {
    return this.httpSer.get(`ky/${id}`);
  }

  // 修改表单
  public putKyId(data: any = {}): Observable<any> {
    return this.httpSer.put(`ky/${data._id}`, data)
  }

  // 获取数据集合
  public getLists(data: any = {}): Observable<any> {
    return this.httpSer.get("ky", data);
  }

  // 批量操作
  public moveState(params:any): Observable<any> {
    return this.httpSer.patch("ky", params);
  }

  // 删除
  public deleteKyId(id:string):Observable<any>{
    return this.httpSer.deleteId(`ky/${id}`);
  }
}