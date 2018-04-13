import { Injectable } from '@angular/core';
import { HttpService } from '@core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApplyService {

  constructor(private httpSer: HttpService) { }

  // 根据id获取详情
  public getApplyId(id: string): Observable<any> {
    return this.httpSer.get(`apply/${id}`);
  }
  
  // 获取数据集合
  public getLists(data: any = {}): Observable<any> {
    return this.httpSer.get("apply", data);
  }

  // 批量操作
  public moveState(data: Array<string> = [], active: number): Observable<any> {
    return this.httpSer.patch("apply", { ids: data, state: active });
  }
  
  // 获取文件
  public getFiles(data:any = {}): Observable<any>{
    return this.httpSer.get("image", data);
  }
}