import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ForumService } from '../forum.service';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { API_ROOT, WebUrl } from '@config';

@Component({
  selector: 'forum-lists',
  templateUrl: './lists.html',
  styleUrls: ["./lists.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [ForumService]
})

export class ListsComponent implements OnInit {
  public keywords: string;
  public isDisabled: boolean = true;
  public state: any;
  private searchTerms = new Subject<string>(); // 搜索
  public tagOptions: Array<any> = [];
  public isLoading: boolean = true;
  public imgRoot: string = API_ROOT;
  public weUrl: string = WebUrl; // 网页链接
  public allChecked = false;  // 是否全选
  public indeterminate = false;
  public ids: Array<string> = [];
  public disabled: boolean = false;
  public categoryOptions = [ // 文章类型
    { value: 'all', label: '所有文章' },
    { value: 0, label: '测试工具集市' },
    { value: 1, label: '知识库' },
  ]
  public stateOptions = [
    { value: 1, label: '快速发布' },
    { value: 0, label: '草稿' },
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
  };
  public getParams: any = { //
    state: "all",  // 选择文章发布状态
    category: "all", // 文章类型
  }
  public tagIds: Array<string> = []; // 标签类型


  // 构造函数
  constructor(private httpSer: ForumService) { }

  // 初始化
  ngOnInit() {
    this.getDatas();
    this.getTags();
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe((value) => {
      this.keywords = value;
      this.getDatas();
    })
  }
  // 获取所有标签
  public getTags(params: any = {}): void {
    params.enable = true;
    this.httpSer.getTags(params).subscribe(({ code, result }) => {
      if (code) {
        this.tagOptions = result.data;
      }
    })
  }

  // 文章类型
  public selectCategory(value): void {
    this.getParams.category = value;
    this.getDatas();
  }

  // 选着标签
  public selectTags(value): void {
    this.tagIds = value;
    if (this.tagIds.length >= 3) {
      this.disabled = true
    } else {
      this.disabled = false
    }
    this.getDatas();
  }

  // 根据文章状态查询
  public switchState(value): void {
    this.allChecked = false;
    this.ids = [];
    this.getParams.state = value;
    this.getDatas();
  }

  // 批量操作
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
      this.getDatas();
    });
  }

  // 单个操作
  public singleState(ids: Array<string>, active: number) {
    this.moveOptions(ids, active);
  }

  // 搜索
  public getKeyword(value: string) {
    this.searchTerms.next(value);
  }

  // 获取数据
  public getDatas(params: any = {}): void {
    this.isLoading = true;
    if (this.keywords) {
      params.keywords = this.keywords;
    }
    Object.keys(this.getParams).forEach(key => {
      if (!Object.is(this.getParams[key], 'all')) {
        params[key] = this.getParams[key];
      }
    });
    if (!params.page || Object.is(params.page, 1)) {
      this.listsData.pagination.current_page = 1;
    }
    if (!!this.tagIds.length) {
      params.tags = this.tagIds.join();
    }
    this.httpSer.getLists(params).subscribe(({ code, result }) => {
      this.isLoading = false;
      if (code) {
        this.listsData = result;
      }
    })
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
      this.isDisabled = false
    } else {
      this.isDisabled = true
    }
    this.listsData.data.length && (this.allChecked = allChecked);
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  // 分页按钮
  public asd(page: number): void {
    this.getDatas({ page: page });
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
}