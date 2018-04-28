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

  // 新增
  public addApply(data: any = {}): Observable<any> {
    return this.httpSer.post("apply", data);
  }

  // 批量操作
  public moveState(data: Array<string> = [], active: number): Observable<any> {
    return this.httpSer.patch("apply", { ids: data, state: active });
  }

  // 修改单个文件
  public putApplyId(data: any = {}): Observable<any> {
    return this.httpSer.put(`apply/${data._id}`, data);
  }

  // 获取文件
  public getFiles(data: any = {}): Observable<any> {
    return this.httpSer.get("image", data);
  }

  // 修改文件状态
  public putFileId(data: any = {}): Observable<any> {
    return this.httpSer.put(`image/${data.id}`, data);
  }

  // 文件保存、
  public addFile(data: any = {}): Observable<any> {
    return this.httpSer.post("image", data);
  }

  // 导出文件
  public outFiles(data: any = {}): Observable<any> {
    return this.httpSer.get("excel", data);
  }
}