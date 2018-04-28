import { Component, ViewEncapsulation, SimpleChanges, ViewChild, OnInit } from "@angular/core";
import { FormGroup, AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { NewsListServier } from "./list.service";
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { API_ROOT, WebUrl } from '@config';


@Component({
  selector: "app-home",
  templateUrl: './list.html',
  styleUrls: ['./list.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NewsListServier, NzMessageService, NzModalService]
})
export class ListComponent implements OnInit {
  // 搜索form
  public keywordForm: FormGroup;
  public keywords: AbstractControl;
  // 初始化数据
  public allChecked = false;
  public indeterminate = false;
  public displayData = [];
  private newsIds = []; // 存储ID集合
  public isLoading: boolean = true;
  public imgRoot: string = API_ROOT;
  public weUrl: string = WebUrl;
  public newsData = { // 文章集合对象
    data: [],
    pagination: {
      total: 0, // 文章总数
      current_page: 1, // 当前页码
      pre_page: 3, // 限制查询 条数
      total_page: 0  // 总的页数
    }
  };
  // 查询参数配置
  public getParams: any = { //
    state: "all",  // 选择文章发布状态
    public: "all"
  }

  // 构造函数
  constructor(private _fb: FormBuilder,
    private newSer: NewsListServier,
    private confirmServ: NzModalService,
    private msg: NzMessageService) {
    this.keywordForm = this._fb.group({
      'keywords': ['', Validators.compose([Validators.required])]
    });
    this.keywords = this.keywordForm.controls['keywords'];
  }

  public ngOnInit() {
    this.getNews();
  }

  // 获取新闻所有数据
  public getNews(params: any = {}) {
    this.isLoading = true;
    if (this.keywords.value) {
      params.keywords = this.keywords.value;
    }
    params.state = this.getParams.state;
    params.public = this.getParams.public
    if (!params.page || Object.is(params.page, 1)) {
      this.newsData.pagination.current_page = 1;
    }

    this.newSer.getNewsData(params).subscribe((res) => {
      if (res.code) {
        this.newsData = res.result;
        this.displayData = res.result.data;
      } else {
        !!res.message && this.msg.error(res.message);
      }
      this.isLoading = false;
    })
  }

  // 检索条件
  public switchState(value: any) {
    if (value === undefined || Object.is(value, (<any>this.getParams).state)) return;
    this.getParams.state = value;
    this.getParams.public = value;
    this.getNews();
  }

  // 搜索
  public searchSubmit() {
    if (this.keywordForm.valid) {
      this.getNews();
    }
  }

  // 清除搜索
  public resetGetParams(): void {
    if (this.keywordForm.valid) {
      this.keywords.setValue("");
      this.getNews();
    }
  }
  // 刷新数据
  public refreshArticles() {
    this.getNews({ page: this.newsData.pagination.current_page });
  }

  // 批量删除
  public deleteAdvs() {
    this.newSer.deleteAdvs(this.newsIds).subscribe((res) => {
      if (res.code) {
        this.getNews({ page: this.newsData.pagination.current_page });
        this.allChecked = false;
        this.displayData = [];
        this.newsIds = [];
      }
    })
  }
  // 分页
  public asd(page) {
    this.getNews({ page: page });
  }
  // 批量删除对话款
  public showConfirm = (arr?: any) => {
    if (arr) {
      this.newsIds = arr;
    }
    if (!this.newsIds.length) {
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
        self.newsIds = [];
        self.allChecked = false;
      }
    });
  };

  public displayDataChange($event) {
    this.displayData = $event;
    this.refreshStatus();
  }

  public refreshStatus() {
    const allChecked = this.displayData.every(value => value.checked === true);
    const allUnChecked = this.displayData.every(value => !value.checked);
    this.newsIds = [];
    this.displayData.forEach((item) => {
      item.checked && this.newsIds.push(item._id);
    })
    this.displayData.length && (this.allChecked = allChecked);
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  public checkAll(value) {
    if (value) {
      this.displayData.forEach(data => {
        data.checked = true;
        this.newsIds.push(data._id);
      });
    } else {
      this.displayData.forEach(data => {
        data.checked = false;
      });
      this.newsIds = [];
    }
    this.refreshStatus();
  }

}