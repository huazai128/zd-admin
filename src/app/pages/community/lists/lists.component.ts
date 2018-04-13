import { Component } from '@angular/core';
import { CommunityService } from '../community.service';
import { Subject } from 'rxjs/Subject';
import { distinctUntilChanged,debounceTime } from 'rxjs/operators';

@Component({
  selector: 'community-lists',
  templateUrl: './lists.html',
  styleUrls: ['./lists.scss']
})

export class ListsComponent {
  public keywords: string;
  public isLoading: boolean = false;
  public isDisabled:boolean = true;
  public ids:Array<string> = [];
  public allChecked:boolean = false;
  public indeterminate:boolean = false;
  public state:string = "all";
  private searchTerms = new Subject<string>(); // 搜索
  public getParams = {
    category: "all",
    state: 'all'
  }
  public categoryOptions = [
    { value: 'all', label: "全部话题" },
    { value: "choice", label: "精选话题" },
    { value: "recommend", label: "版主推荐" },
  ]
  public stateOptions = [
    { value: 1, label: '快速发布' },
    { value: 0, label: '快速屏蔽' },
    { value: -1, label: '回收箱' },
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

  constructor(private communitySer: CommunityService) { }

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
    if (!Object.is(this.getParams.category, "all")) {
      if (Object.is(this.getParams.category, "choice")) {
        params.choice = 1;
      }
      if (Object.is(this.getParams.category, "recommend")) {
        params.recommend = 1;
      }
    }
    if (!params.page || Object.is(params.page, 1)) {
      this.listsData.pagination.current_page = 1;
    }
    this.communitySer.getLists(params).subscribe(({ code, result }) => {
      if (code) this.listsData = result;
    })
  }

  // 文章分类
  public selectCategory($event):void{
    this.getParams.category = $event;
    this.getLists();
  }

  // 文章发表状态
  public switchState($event):void{
    this.getParams.state = $event;
    this.getLists();
  }

  // 快速操作
  public moveState(value):void{
    this.moveOptions(this.ids, value);
  }

  // 批量操作方法
  private moveOptions(ids, value): void {
    this.communitySer.moveState(ids, value).subscribe((res) => {
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

  // 精选
  public checkChioce(value,_id):void{
    const choice = value ? 1 : 0;
    this.communitySer.putCommunityId({ choice:choice,_id:_id }).subscribe((res) => {
      this.getLists();
    })
  }

  // 推荐
  public checkRecommend(value,_id):void{
    const recommend = value ? 1 : 0;
    this.communitySer.putCommunityId({ recommend:recommend,_id:_id }).subscribe((res) => {
      this.getLists();
    })
  }

  // 操作
  public singleState(ids: Array<string>, active: number) {
    this.moveOptions(ids, active);
  }
}