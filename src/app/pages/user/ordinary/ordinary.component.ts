import { Component, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { UserService } from '../user.service';

@Component({
  selector: "user-ordinary",
  templateUrl: "./ordinary.html",
  styleUrls: ['./ordinary.scss'],
  encapsulation: ViewEncapsulation.None
})

export class OrdinaryComponent {
  public keywords: string;
  private searchTerms = new Subject<string>();
  public isLoading: boolean = true;
  public indeterminate = false;
  public radioValue: number = 0;
  public demoValue = 3;
  public selectedOption = 1;
  public options: any = [
    { value: 0, label: "分钟" },
    { value: 1, label: "小时" },
    { value: 2, label: "天" },
  ]
  public listsData = {
    data: [],
    pagination: {
      total: 0,
      current_page: 1,
      pre_page: 10,
      total_page: 0
    }
  };

  constructor(private httpSer: UserService, private modalSer: NzModalService, private msg: NzMessageService) { }

  ngOnInit() {
    this.getUsers();
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe((value) => {
      this.keywords = value;
      this.getUsers();
    })
  }

  // 获取所有普通用户
  private getUsers(params: any = {}): void {
    this.isLoading = true;
    params.type = 0; // 普通用户
    if (this.keywords) {
      params.keywords = this.keywords;
    }
    if (!params.page || Object.is(params.page, 1)) {
      this.listsData.pagination.current_page = 1;
    }
    this.httpSer.getLists(params).subscribe(({ code, result }) => {
      if (code) {
        this.listsData = result;
      }
      this.isLoading = false;
    })
  }

  // 搜索
  public getKeyword(value: string) {
    this.searchTerms.next(value);
  }

  // 
  public resetPws(_id: string, reset: any, num: number, title: string, status?: number): void {
    let arr = [1, 0, -1, -2];
    if (arr.includes(status)) {
      this.radioValue = status;
    }
    this.modalSer.open({
      title: title,
      content: reset,
      showConfirmLoading: true,
    }).subscribe((res) => {
      if (Object.is(res, 'onOk')) {
        if (num === 1) {
          this.putAuthId({ _id: _id, reset: true });
        }
        if (num === 2) {
          let query: any = {
            status: this.radioValue,
            _id: _id
          };
          if (this.radioValue === -1) {
            let time;
            switch (this.selectedOption) {
              case 0:
                time = this.demoValue * 60 * 1000;
                break;
              case 1:
                time = this.demoValue * 60 * 60 * 1000;
                break;
              case 2:
                time = this.demoValue * 60 * 60 * 1000 * 24;
                break;
            }
            query.time = time;
            query.time_name = `${this.demoValue}${this.options[this.selectedOption].label}`;
          }
          if (this.radioValue === 0) {
            query.time = 1 * 60 * 60 * 1000;
            query.time_name = '禁言一小时'
          }
          console.log(query);
          this.putAuthId(query);
        }
        if (num === 3) {
          this.putAuthId({ _id: _id, status: -3 });
        }
      }
    })
  }

  private putAuthId(params: any = {}): void {
    this.httpSer.putUserId(params).subscribe(({ code }) => {
      this.getUsers();
    });
  }

  // 分页按钮
  public asd(page: number): void {
    this.getUsers({ page: page });
  }
}