import { Component, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { ApplyService } from '../apply.service';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { API_ROOT } from '@config';

@Component({
  selector: "apply-lists",
  templateUrl: "./lists.html",
  styleUrls: ['./lists.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApplyService]
})

export class ApplyListsComponent {
  public keywords: string;
  public isLoading: boolean = false;
  public loading: boolean = false;
  public isDisabled: boolean = true;
  public ids: Array<string> = [];
  public allChecked: boolean = false;
  public indeterminate: boolean = false;
  public isVisible: boolean = false;
  public state: string = "all";
  private searchTerms = new Subject<string>(); // 搜索
  public time: Array<any> = [];
  public file: any = {
    apply_id: '',
    state: 0,
  }
  public headers = {
    "Authorization": 'Bearer ' + localStorage.getItem('id_token')
  }
  public imgUplaod = `${API_ROOT}/image`; // 图片上传接口
  public getParams = {
    mold: 'all',
    state: 'all'
  }
  public moldOptions = [
    { value: 'all', label: "全部申请" },
    { value: 0, label: "功能测试" },
    { value: 1, label: "兼容测试" },
  ]
  public stateOptions = [
    { value: 1, label: '快速通过' },
    { value: 0, label: '待审核' },
    { value: -1, label: '不通过' },
    { value: -2, label: '回收站' },
  ]
  public listsData = {
    data: [],
    pagination: {
      total: 0,
      current_page: 1,
      pre_page: 10,
      total_page: 0,
    }
  }
  public fileDatas: any = [
    { url: '', state: false, _id: "", process: 1, open: true },
    { url: '', state: false, _id: "", process: 2 },
    { url: '', state: false, _id: "", process: 3 },
  ]
  constructor(private httpSer: ApplyService, private msg: NzMessageService) { }
  // 初始化
  ngOnInit() {
    this.getLists();
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe((value) => {
      this.keywords = value;
      this.getLists();
    })
  }
  // 获取数据
  public getLists(params: any = {}): void {
    this.allChecked = false;
    if (this.keywords) {
      params.keywords = this.keywords;
    }
    Object.keys(this.getParams).forEach(key => {
      if (!Object.is(this.getParams[key], 'all')) {
        params[key] = this.getParams[key];
      }
    });
    if (this.time.length) {
      params.start = new Date(this.time[0]).getTime();
      params.end = new Date(this.time[1]).getTime();
    }
    if (!params.page || Object.is(params.page, 1)) {
      this.listsData.pagination.current_page = 1;
    }
    this.httpSer.getLists(params).subscribe(({ code, result }) => {
      if (code) this.listsData = result;
    })
  }

  // 选择时间
  public changeDate(value): void {
    let arr = value.filter((item) => item !== null);
    this.time = arr;
    this.getLists();
  }

  // 选择测试类型
  public selectMold($event): void {
    this.getParams.mold = $event;
    this.getLists();
  }

  // 申请状态
  public switchState($event): void {
    this.getParams.state = $event;
    this.getLists();
  }

  // 快速操作
  public moveState(value): void {
    this.moveOptions(this.ids, value);
  }

  // 批量操作方法
  private moveOptions(ids, value): void {
    this.httpSer.moveState(ids, value).subscribe((res) => {
      this.ids = [];
      this.isDisabled = true;
      this.indeterminate = false;
      this.allChecked = false;
      this.getLists();
    });
  }
  // 搜索
  public getKeyword(value: string) {
    this.searchTerms.next(value);
  }

  // 自由选择
  public refreshStatus(): void {
    const allChecked = this.listsData.data.every((item) => item.checked === true);
    const allUnChecked = this.listsData.data.every(item => !item.checked);
    this.ids = [];
    this.listsData.data.forEach((item) => {
      item.checked && this.ids.push(item._id);
    })
    if (!!this.ids.length) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
    this.listsData.data.length && (this.allChecked = allChecked);
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  // 分页按钮
  public asd(page: number): void {
    this.getLists({ page: page });
  }

  // 全选
  public checkAll(value): void {
    this.listsData.data.forEach((item) => {
      item.checked = value;
      value && this.ids.push(item._id);
      !value && (this.ids = []);
    });
    value && (this.isDisabled = false);
    !value && (this.isDisabled = true);
  }

  // 操作
  public singleState(ids: Array<string>, active: number) {
    this.moveOptions(ids, active);
  }

  // 显示弹窗
  public showModal(value): void {
    this.isVisible = true;
    this.file.apply_id = value;
    this.getFiles();
  }

  // 获取文件
  private getFiles(): void {
    this.httpSer.getFiles({ apply_id: this.file.apply_id }).subscribe(({ code, result }) => {
      if (result.data.length) {
        this.fileDatas = [...result.data.slice(0, 3), ...this.fileDatas.slice(0, (result.data.length >= 3) ? 0 : (3 - result.data.length))];
        let idx = 0;
        this.fileDatas.map((item,index) => {
          item.url && (item.open = true);
          item.url && !!item.state && (idx = index + 1);
          !item.url && (item.open = false);
        })
        this.fileDatas[idx].open = true;
      } else {
        this.getInitData();
      }
    })
  }
  private getInitData(): void {
    this.fileDatas = [
      { url: '', state: false, _id: "", process: 1, open: true },
      { url: '', state: false, _id: "", process: 2 },
      { url: '', state: false, _id: "", process: 3 },
    ]
  }

  // 监听文件改变
  handleChange(info: { file: UploadFile }, type: number) {
    this.file.process = type;
    if (info.file.status === 'uploading') {
      this.loading = true;
      return;
    }
    if (!!info.file.response && info.file.response.code) {
      this.msg.success(info.file.response.message);
      this.getFiles();
    }
  }

  // 确认
  public handleOk(): void {
    this.isVisible = false;
    this.file = {
      apply_id: '',
      state: 0
    }
    this.getInitData();
  }
}