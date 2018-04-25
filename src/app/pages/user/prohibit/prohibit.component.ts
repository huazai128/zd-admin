import { Component, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserService } from '../user.service';

@Component({
  selector: "user-prohibit",
  templateUrl: "./prohibit.html",
  styleUrls: ['./prohibit.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ProhibitComponent {
  public keywords: string;
  private searchTerms = new Subject<string>();
  public isLoading: boolean = true;
  public indeterminate = false;
  public disabled: boolean = false;
  public isVisible: boolean = false;
  public _id: string;
  public listsData = {
    data: [],
    pagination: {
      total: 0,
      current_page: 1,
      pre_page: 10,
      total_page: 0
    }
  };

  constructor(private httpSer: UserService) { }

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
    params.proh = 1;
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

  // 分页按钮
  public asd(page: number): void {
    this.getUsers({ page: page });
  }

  // 解除封禁
  public noProd(_id: string): void {
    this._id = _id;
    this.isVisible = true;
  }

  // 确认解除
  public handleOk():void{
    this.putAuthId({ _id: this._id,status:1 });
  }

  // 取消
  public handleCancel():void{
    this.isVisible = false;
  }

  private putAuthId(params: any = {}): void {
    this.httpSer.putUserId(params).subscribe(({ code }) => {
      this.isVisible = false;
      if(code){
        this.getUsers();
      }
    });
  }


}