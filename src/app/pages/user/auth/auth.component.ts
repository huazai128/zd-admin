import { Component, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { AuthService } from './auth.serivce';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: "user-auth",
  templateUrl: "./auth.html",
  styleUrls: ['./auth.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AuthService]
})

export class AuthComponent {
  public keywords: string;
  public validateForm: FormGroup;
  private searchTerms = new Subject<string>();
  public isLoading: boolean = true;
  public indeterminate = false;
  public user: any = {};
  public _id: string;
  public isVisible: boolean = false;
  public checked: any = [];
  public listsData = {
    data: [],
    pagination: {
      total: 0,
      current_page: 1,
      pre_page: 10,
      total_page: 0
    }
  };
  public checkLists = [
    { label: "内容管理", value: 0, checked: false },
    { label: "社区管理", value: 1, checked: false },
    { label: "项目管理", value: 2, checked: false },
    { label: "用户管理", value: 3, checked: false },
    { label: "系统管理", value: 4, checked: false },
  ]

  constructor(private httpSer: AuthService,
    private fb: FormBuilder,
    private modalSer: NzModalService,
    private msg: NzMessageService) {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required, Validators.pattern(/(^s*)|(s*$)/g)]],
      email: ["", [Validators.required, Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]],
      // password: [null, [Validators.required, Validators.pattern(/(^s*)|(s*$)/g)]],
    });
  }

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
    params.type = 2; // 普通用户
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

  // 重置密码
  public resetPws(_id: string, reset: any, num: number, title: string, ): void {
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
          this.putAuthId({ _id: _id, status: 0, enable: false });
        }
      }
    })
  }

  private putAuthId(params: any = {}): void {
    this.httpSer.putUserId(params).subscribe(({ code }) => {
      this.getUsers();
    });
  }

  // 取消
  public handleCancel(): void {
    this.isVisible = false;
    this.checked = [];
    this._id = '';
    this.user = {};
    this.checkLists.forEach((item) => (item.checked = false));
    this.isVisible = false;
    this.validateForm.reset(); // 重置表单
  }

  // 确认
  public handleOk(): void {
    if (this.validateForm.valid && this.checked.length) {
      let data = Object.assign(this.validateForm.value, { power: this.checked.join('') });
      if (this._id) {
        data._id = this._id;
      }
      this.httpSer[this._id ? 'putUserId' : 'addUser'](data).subscribe(({ code, message }) => {
        if (code) {
          this.handleCancel();
          this.getUsers();
        } else {
          this.msg.info(message);
        }
      })
    } else {
      this.msg.info('请完成表单填写！');
    }
  }

  // 新增用户
  public showModal(user?: any) {
    if (user) {
      this._id = user._id;
      this.user = {
        username: user.username,
        email: user.email,
      };
      this.checked = (<any>user).power;
      this.checkLists.forEach((item) => (<any>user).power.includes(item.value) && (item.checked = true));
      this.validateForm.setValue(this.user)
    };
    this.isVisible = true;
  }

  // 获取选中的权限
  public getCheck(value): void {
    let arr = [];
    value.forEach((item) => {
      if (item.checked) {
        arr.push(item.value);
      }
    });
    this.checked = arr;
  }

  // 是否启用
  public refreshStatus(id: string, enable: boolean): void {
    this.putAuthId({ _id: id, enable: enable });
  }
}