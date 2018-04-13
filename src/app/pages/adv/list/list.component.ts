import { Component, ViewEncapsulation, SimpleChanges, ViewChild } from "@angular/core";
import { FormGroup, AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { AdvListServier } from './list.servier';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { API_ROOT } from '@config';

@Component({
  selector: "adv-list",
  templateUrl: "./list.html",
  styleUrls: ['./list.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AdvListServier]
})

export class AdvListComponent {
  // 搜索form
  public keywordForm: FormGroup;
  public keywords: AbstractControl;
  public allChecked = false; // 全选
  public indeterminate = false;
  public displayData = [];
  public advIds = [];
  public imgRoot:string = API_ROOT;
  public isLoading = true;
  // 查询参数配置
  public getParams: any = {
    state: "all",  // 选择广告位状态
  }
  public advs = { //
    data: [],
    pagination: {
      total: 0, // 广告总数总数
      current_page: 1, // 当前页码
      pre_page: 10, // 限制查询 条数
      total_page: 0  // 总的页数
    }
  };

  // 构造函数
  constructor(private _fb: FormBuilder, private advSer: AdvListServier, private msg: NzMessageService, private confirmServ: NzModalService) {
    this.keywordForm = this._fb.group({
      'keywords': ['', Validators.compose([Validators.required])]
    });
    this.keywords = this.keywordForm.controls['keywords'];
  }
  // 初始化数据
  ngOnInit() {
    this.getAdvs();
  }

  // 检索条件
  public switchState(value) {
    if (value == undefined && Object.is(value, (<any>this.getParams).state)) return;
    this.getParams.state = value;
    this.getAdvs();
  }
  // 搜索
  public searchSubmit(value) {
    if (this.keywordForm.valid) {
      this.getAdvs();
    }
  }
  // 清除搜索
  public resetGetParams(): void {
    if (this.keywordForm.valid) {
      this.keywords.setValue("");
      this.getAdvs();
    }
  }

  // 刷新
  public refreshArticles(): void {
    this.getAdvs({ page: this.advs.pagination.current_page });
  }

  // 获取广告位所有数据
  public getAdvs(params: any = {}) {
    this.isLoading = true;
    // keywords
    if (this.keywords.value) {
      params.keywords = this.keywords.value;
    }
    // 广告位状态
    params.state = this.getParams.state;
    // 如果请求的是第一页，则设置翻页组件的当前页为第一页
    if (!params.page || Object.is(params.page, 1)) {
      this.advs.pagination.current_page = 1;
    }
    this.advSer.getAdvs(params).subscribe((res) => {
      if(res.code){
        this.advs = res.result;
        this.displayData = res.result.data;
      }
      this.isLoading = false;
    })
  }

  // 批量删除
  public deleteAdvs() {
    this.advSer.deleteAdvs(this.advIds).subscribe((res) => {
      if (res.code) {
        this.getAdvs({ page: this.advs.pagination.current_page });
        this.allChecked = false;
        this.displayData = [];
        this.advIds = [];
      }
    })
  }

  // 批量删除对话款
  public showConfirm = (arr?: any) => {
    if (arr) {
      this.advIds = arr;
    }
    if (!this.advIds.length) {
      this.msg.info("请选择删除广告位");
      return false;
    }
    let self = this;
    this.confirmServ.confirm({
      title: '删除提示！',
      content: '<b>确定要删除数据？</b>',
      onOk() {
        self.deleteAdvs();
      },
      onCancel() {
        self.displayData.forEach(data => {
          data.checked = false;
        });
        self.advIds = [];
        self.allChecked = false;
      }
    });
  };

  public displayDataChange($event) {
    this.displayData = $event;
    this.refreshStatus();
  }

  public asd(page){
    this.getAdvs({ page:page });
  }

  public refreshStatus(page?:any) {
    const allChecked = this.displayData.every(value => value.checked === true);
    const allUnChecked = this.displayData.every(value => !value.checked);
    this.advIds = [];
    this.displayData.forEach((item) => {
      item.checked && this.advIds.push(item._id);
    })
    this.displayData.length && (this.allChecked = allChecked);
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  public checkAll(value) {
    if (value) {
      this.displayData.forEach(data => {
        data.checked = true;
        this.advIds.push(data._id);
      });
    } else {
      this.displayData.forEach(data => {
        data.checked = false;
      });
      this.advIds = [];
    }
    this.refreshStatus();
  }
}