import { Component, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { PlanService } from '../plan.service';
import { API_ROOT } from '@config';

@Component({
  selector: "apply-lists",
  templateUrl: "./lists.html",
  styleUrls: ['./lists.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [PlanService]
})

export class PlanListsComponent {
  public keywords: string;
  public isLoading: boolean = false;
  public isDisabled: boolean = true;
  public ids: Array<string> = [];
  public allChecked: boolean = false;
  public indeterminate: boolean = false;
  public state: string = "all";
  private searchTerms = new Subject<string>(); // 搜索
  public time: Array<any> = [];
  public urlRoot: string = API_ROOT;
  public getParams = {
    state: 'all'
  }
  public stateOptions = [
    { value: 1, label: '快速通过' },
    { value: -2, label: '回收站' },
  ]
  public listsData = {
    data: [],
    pagination: {
      total: 0, // 文章总数
      current_page: 1, // 当前页码
      pre_page: 10, // 限制查询 条数
      total_page: 0  // 总的页数
    }
  }
  constructor(private httpSer: PlanService) { }
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
    if (!Object.is(this.getParams.state, "all")) {
      params.state = this.getParams.state;
    }
    if (this.time.length) {
      params.start = new Date(this.time[0]).getTime();
      params.end = new Date(this.time[1]).getTime();
    }

    if (!params.page || Object.is(params.page, 1)) {
      this.listsData.pagination.current_page = 1;
    }
    this.httpSer.getLists(params).subscribe(({ code, result }) => {
      if (code) { this.listsData = result };
    })
  }

  // 选择时间
  public changeDate(value): void {
    let arr = value.filter((item) => item !== null);
    this.time = arr;
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
}