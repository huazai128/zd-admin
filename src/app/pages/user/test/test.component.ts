import { Component, ViewEncapsulation } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { Subject } from 'rxjs/Subject';
import { UserService } from '../user.service';


@Component({
  selector: "user-test",
  templateUrl: "./test.html",
  styleUrls: ['./test.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TestComponent {
  public keywords: string;
  private searchTerms = new Subject<string>();
  public isLoading: boolean = true;
  public indeterminate = false;
  public radioValue: number = 0;
  public demoValue = 3;
  public selectedOption = 1;
  public isVisible: boolean = false;
  public validateForm: FormGroup;
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
  constructor(private httpSer: UserService,
    private modalSer: NzModalService,
    private fb: FormBuilder,
    private msg: NzMessageService) {
    this.validateForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(26)]],
      confirm: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(26), this.confirmationValidator]],
      name: ['', [Validators.required]],
      card: ['', [Validators.required, Validators.pattern(/^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/)]],
      company: ['', [Validators.required]],
      job: ['', [Validators.required]],
      record: ['', [Validators.required]],
      iphone: ['', [Validators.required, Validators.pattern(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)]],
    });
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
  };

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
    params.type = 1;
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

  // 改变审核状态
  public changeState(id: string, c_state: number): void {
    this.putAuthId({ _id: id, c_state: c_state });
  }

  public addUserModal(): void {
    this.isVisible = true;
  }

  public handleOk(): void {
    if (this.validateForm.valid) {
      this.httpSer.addUser({ ...this.validateForm.value, type: 1 }).subscribe(({ code, message }) => {
        if (code) {
          this.getUsers();
          this.handleCancel();
        } else {
          this.msg.info(message);
        }
      })
    }
  }

  public handleCancel(): void {
    this.isVisible = false;
    this.validateForm.reset();
  }

}