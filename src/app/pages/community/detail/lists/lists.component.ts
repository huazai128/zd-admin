import { Component, Input } from "@angular/core";
import { CommunityService } from '../../community.service';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute, Params } from '@angular/router';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Output } from "@angular/core";
import { WebUrl } from '@config';

@Component({
  selector: 'comment-lists',
  templateUrl: './lists.html',
  styleUrls: ['./lists.scss']
})

export class CommnetsComponent {
  public keywords: string;
  public isLoading: boolean = false;
  public isDisabled: boolean = true;
  public ids: Array<string> = [];
  public allChecked: boolean = false;
  public indeterminate: boolean = false;
  public state: string | number = "all";
  private searchTerms = new Subject<string>(); // 搜索
  public id: string;
  public imgUrl: string = WebUrl;
  public comments: any = {
    data: [],
    pagination: {
      total: 0, // 文章总数
      current_page: 1, // 当前页码
      pre_page: 10, // 限制查询 条数
      total_page: 0  // 总的页数
    }
  };
  public commentTitle = '全部评论(0)';
  public getParams = {
    state: 'all'
  }
  public stateOptions = [
    { value: 1, label: '快速发布' },
    { value: -1, label: '回收箱' },
  ]
  constructor(private httpStr: CommunityService,
    private route: ActivatedRoute) { 
      this.searchTerms.pipe(
        debounceTime(300),
        distinctUntilChanged(),
      ).subscribe((value) => {
        this.keywords = value;
        this.getCommentsLists();
      })
    }

  ngOnInit() {
    this.id = this.route.snapshot.queryParams["id"];
    setTimeout(() => {
      this.isLoading = true;
    })
  }

  // 视图初始化之后调用
  ngAfterViewInit() {
    this.getCommentsLists();
  }

  // 获取当前文章所有评论
  private getCommentsLists(params: any = {}): void {
    if (this.keywords) {
      params.keywords = this.keywords;
    }
    if (!Object.is(this.getParams.state, "all")) {
      params.state = this.getParams.state;
    }
    if (!params.page || Object.is(params.page, 1)) {
      this.comments.pagination.current_page = 1;
    }
    params.id = this.id
    this.httpStr.getComments(params).subscribe(({ code, result }) => {
      setTimeout(() => {
        this.isLoading = false;
      })
      if (code) {
        this.comments = result;
        this.commentTitle = `全部评论(${result.pagination.total})`
      }
    })
  }

  // 评论状态
  public switchState(value): void {
    this.getParams.state = value;
    this.getCommentsLists();
  }

  // 搜索
  public getKeyword(value):void{
    this.searchTerms.next(value);
  }

  // 快速操作
  public moveState(value): void {
    this.moveOptions(this.ids, value, this.id);
  }

  // 单个操作
  public singleState(ids, value): void {
    this.moveOptions(ids, value, this.id);
  }

  // 批量操作方法
  private moveOptions(ids, value, id): void {
    this.httpStr.moveCommentState(ids, value, id).subscribe(({ code }) => {
      this.ids = [];
      this.isDisabled = true;
      this.indeterminate = false;
      this.allChecked = false;
      if (code) {
        this.getCommentsLists();
      }
    });
  }

  // 自由选择
  public refreshStatus(): void {
    const allChecked = this.comments.data.every((item) => item.checked === true);
    const allUnChecked = this.comments.data.every(item => !item.checked);
    this.ids = [];
    this.comments.data.forEach((item) => {
      item.checked && this.ids.push(item._id);
    })
    if (!!this.ids.length) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
    this.comments.data.length && (this.allChecked = allChecked);
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  // 分页按钮
  public asd(page: number): void {
    this.getCommentsLists({ page: page });
  }
  // 全选
  public checkAll(value): void {
    this.comments.data.forEach((item) => {
      item.checked = value;
      value && this.ids.push(item._id);
      !value && (this.ids = []);
    });
    value && (this.isDisabled = false);
    !value && (this.isDisabled = true);
  }
}