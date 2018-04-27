import { Component } from '@angular/core';
import { KeywordsSerive } from './keywords.service';

@Component({
  selector: "community-keywords",
  templateUrl: "./keywords.html",
  styleUrls: ['./keywords.scss'],
  providers: [KeywordsSerive],
})

export class KeywordsComponent {
  public editKy: any; // 保存当前
  public isVisible: boolean = false;
  public kys = []; // 缓存所有集合
  public pagination = {};
  public kyId: string;
  public dataKys = null;
  public isLoading = true;

  constructor(private httpSer: KeywordsSerive) { }

  // 初始化
  ngOnInit() {
    this.getKys();
  }

  // 新增标签
  public addKy(data) {
    this.httpSer.addKy(data).subscribe((res) => {
      this.editKy = null;
      this.getKys();
    })
  }

  // 获取数据
  public getKys(params: any = {}) {
    this.httpSer.getLists(params).subscribe(({ code, result }) => {
      if (code) {
        this.kys = result.data;
        this.pagination = result.pagination;
      }
      this.isLoading = false;
    })
  }

  // 获取编辑信息
  public _editKy(id: string) {
    this.httpSer.getKyId(id).subscribe(({ code, result }) => {
      this.editKy = result;
    })
  }

  // 修改编辑信息
  public putKy(data) {
    this.httpSer.putKyId(Object.assign(this.editKy, data)).subscribe(({ code, result }) => {
      if (code) {
        this.editKy = null;
        this.getKys();
      }
    })
  }

  // 重置表单
  public resetKy(): void {
    this.editKy = null;
  }

  // 置顶操作
  public _topKy(data: any = {}): void {
    this.httpSer.moveState(data).subscribe(({ code }) => {
      if (code) { this.getKys() };
    })
  }

  // 删除操作
  public _stateKy(data: any): void {
    this.isVisible = true;
    this.dataKys = data;
  }

  // 确认删除
  public handleOk(): void {
    this.moveStateChange(this.dataKys);
  }

  // 取消删除
  public handleCancel(): void {
    this.isVisible = false;
    this.dataKys = null;
  }

  // 分页操作
  public _pageKys(page: number) {
    this.getKys({ page: page })
  }

  // 更改状态
  public _switchState(value): void {
    this.getKys({ state: value })
  }

  // 搜索
  public _kySearch(value): void {
    this.getKys({ keywords: value })
  }

  // 批量操作
  public _moveState(data: any): void {
    this.moveStateChange(data);
  }

  private moveStateChange(data): void {
    this.httpSer.moveState(data).subscribe(({ code, result }) => {
      this.isVisible = false;
      this.dataKys = null;
      if (code) { this.getKys() };
    })
  }
}