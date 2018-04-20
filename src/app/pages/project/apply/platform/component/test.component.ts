import { Component, ViewEncapsulation, Input, Output, EventEmitter,OnChanges,SimpleChanges } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { UserService } from '../../../../user/user.service';

@Component({
  selector: "plat-user",
  templateUrl: "./test.html",
  styleUrls: ['./test.scss'],
  providers: [UserService],
  encapsulation: ViewEncapsulation.Native
})

export class TestComponent implements OnChanges {
  @Input() isVisible: boolean;
  @Input() id:string;
  @Output() onHideModal = new EventEmitter<any>(); 
  @Output() onOk = new EventEmitter<any>(); 

  public keywords: string;
  private searchTerms = new Subject<string>();
  public isLoading: boolean = true;
  public indeterminate = false;
  public userData = {
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

  ngOnChanges(changes:SimpleChanges){
    console.log(changes);
  }

  // 获取所有普通用户
  private getUsers(params: any = {}): void {
    this.isLoading = true;
    params.type = 1;
    params.status = 1;
    params.p_state = true;
    if (this.keywords) {
      params.keywords = this.keywords;
    }
    if (!params.page || Object.is(params.page, 1)) {
      this.userData.pagination.current_page = 1;
    }
    this.httpSer.getLists(params).subscribe(({ code, result }) => {
      if (code) {
        this.userData = result;
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

  // 确认
  public handleOk(): void {
    this.onOk.emit(this.id);
  }

  // 取消
  public handleCancel(): void {
    this.onHideModal.emit(false);
  }

  // 
  public getUserId(id: string): void {
    this.id = id;
    this.userData.data.forEach((item) => {
      item.checked = false;
      item._id == id && (item.checked = true);
    })
  }

}