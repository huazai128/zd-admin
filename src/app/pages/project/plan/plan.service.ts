import { Injectable } from '@angular/core';
import { HttpService } from '@core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PlanService {

  constructor(private httpSer: HttpService) { }

  // 根据id获取详情
  public getPlanId(id: string): Observable<any> {
    return this.httpSer.get(`plan/${id}`);
  }

  // 修改表单
  public putPlanId(data: any = {}): Observable<any> {
    return this.httpSer.put(`plan/${data._id}`, data)
  }

  // 获取数据集合
  public getLists(data: any = {}): Observable<any> {
    return this.httpSer.get("plan", data);
  }

  // 批量操作
  public moveState(data: Array<string> = [], active: number): Observable<any> {
    return this.httpSer.patch("plan", { ids: data, state: active });
  }


}