import { Component, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, RouterStateSnapshot } from '@angular/router';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { Subject } from 'rxjs/Subject';
import { distinctUntilChanged, debounceTime, filter, map, mergeMap } from 'rxjs/operators';
import { ApplyService } from '../apply.service';
import { API_ROOT } from '@config';

@Component({
  selector: "apply-lists",
  templateUrl: "./lists.html",
  styleUrls: ['./lists.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApplyService]
})

export class PlatformListsComponent {
  public keywords: string;
  public isLoading: boolean = false;
  public loading: boolean = false;
  public isDisabled: boolean = true;
  public ids: Array<any> = [];
  public allChecked: boolean = false;
  public indeterminate: boolean = false;
  public isVisible: boolean = false;
  public state: string = "all";
  private searchTerms = new Subject<string>(); // 搜索
  public time: Array<any> = [];
  public userShow: boolean = false;
  public id: string;
  public u_id: string;
  public urlRoot: string = API_ROOT;
  public file: any = {
    apply_id: '',
    state: 0,
  };
  public headers = {
    "Authorization": 'Bearer ' + localStorage.getItem('id_token')
  };
  public imgUplaod = `${API_ROOT}/image`; // 图片上传接口
  public getParams = {
    mold: 'all',
    state: 'all'
  };
  public moldOptions = [
    { value: 'all', label: "全部申请" },
    { value: 0, label: "功能测试" },
    { value: 1, label: "兼容测试" },
  ];
  public stateOptions = [
    { value: 1, label: '快速通过' },
    { value: -2, label: '回收站' },
  ];
  public listsData = {
    data: [],
    pagination: {
      total: 0,
      current_page: 1,
      pre_page: 10,
      total_page: 0,
    }
  };
  public fileDatas: any = [
    { url: '', state: 0, _id: "", process: 1, p_url: '', open: true },
    { url: '', state: 0, _id: "", process: 2, p_url: '' },
    { url: '', state: 0, _id: "", process: 3, p_url: '' },
  ];
  constructor(private httpSer: ApplyService,
    private msg: NzMessageService,
    private router: Router,
    private route: ActivatedRoute) {
  }
  // 初始化
  ngOnInit() {
    this.getLists();
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe((value) => {
      this.keywords = value;
      this.getLists();
    });
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
    params.style = 1;
    this.httpSer.getLists(params).subscribe(({ code, result }) => {
      if (code) { this.listsData = result }
    });
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
    this.getInitData();
    this.httpSer.getFiles({ apply_id: this.file.apply_id }).subscribe(({ code, result }) => {
      if (result.data.length) {
        setTimeout(() => {
          this.fileDatas = [...result.data.slice(0, 3), ...this.fileDatas.slice(result.data.length, 3)];
          let arr = this.fileDatas.filter((item) => !!Number(item.state));
          this.fileDatas.map((item) => {
            item.open = false;
            return item;
          })
          if (!!arr.length) {
            this.fileDatas[arr.length >= 2 ? 2 : arr.length].open = true;
            this.fileDatas[arr.length - 1].open = true;
          } else {
            this.fileDatas[0].open = true;
          }
        })
      }
    })
  }
  // 重新初始化数据
  private getInitData(): void {
    this.fileDatas = [
      { url: '', state: 0, _id: "", process: 1, p_url: '', open: true },
      { url: '', state: 0, _id: "", process: 2, p_url: '' },
      { url: '', state: 0, _id: "", process: 3, p_url: '' },
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
  // 改变文件状态
  public changeState(data: any): void {
    data.apply_id = this.file.apply_id;
    data.state = data.state ? 1 : 0;
    this.httpSer[data.id ? 'putFileId' : 'addFile'](data).subscribe((res) => {
      this.getFiles();
      this.getLists();
    })
  }

  // 显示派单弹窗
  public showModalUser(id: string, u_id: string): void {
    this.id = id;
    this.u_id = u_id;
    this.userShow = true;
  }

  // 隐藏派单弹窗
  public onHide(): void {
    this.userShow = false;
  }

  // 获取用户ID
  public selectUserId(user_id): void {
    this.putUser({ _id: this.id, p_user: user_id, p_state: 1 })
  }

  // 派单
  private putUser(params): void {
    this.httpSer.putApplyId(params).subscribe((res) => {
      this.userShow = false;
      this.getLists();
    })
  }

  // 删除
  public removeFile(id: string, state: any): void {
    this.httpSer.putFileId({ id: id, state: -1, remove: true }).subscribe((res) => {
      this.getFiles();
    })
  }

  // // 导出文件
  // public outFile(): void {
  //   let ids: Array<any> = (<any>this.ids).join('');
  //   this.httpSer.outFiles({ ids: ids, type: 1 }).subscribe((res) => {
  //     console.log(res);
  //   })
  // }
}
