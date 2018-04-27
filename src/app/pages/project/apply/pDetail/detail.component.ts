import { Component, ViewEncapsulation } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { store } from "@store/store";
import { API_ROOT } from '@config';
import { debounceTime } from 'rxjs/operators';
import { ApplyService } from '../apply.service';

@Component({
  selector: "apply-detail",
  templateUrl: "./detail.html",
  styleUrls: ['./detail.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApplyService]
})

export class PDetailComponent {
  public validateForm: FormGroup;
  public isVisible: boolean = false;
  public loading: boolean = false;
  public _id: string;
  private isStore: boolean = false;
  public applyData: any = {}; // 用于存储
  public moldOptions = [
    { value: 0, label: "功能测试" },
    { value: 1, label: "兼容测试" },
  ];
  constructor(private fb: FormBuilder,
    private httpSer: ApplyService,
    private router: Router,
    private route: ActivatedRoute,
    private msg: NzMessageService, ) {
    this.validateForm = this.fb.group({
      mold: [0, [Validators.required]],
      company: ["", [Validators.required]],
      name: ["", [Validators.required]],
      job: ["", [Validators.required]],
      phone: ["", [Validators.required, Validators.pattern(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)]],
      email: ["", [Validators.required, Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]],
      qq: ["", [Validators.required]],
      content: [""],
    });
  }

  public ngOnInit() {
    this.getRoute();
    if (!!store.get("apply") && !this._id) {
      this.isVisible = true;
    }
    this.validateForm.valueChanges.pipe(
      debounceTime(300),
    ).subscribe((res) => {
      !this.isStore && store.set("apply", res);
    });
  }

  // 表单提交
  public submitForm(): void {
    if (this.validateForm.valid) {
      let data = Object.assign(this.applyData, this.validateForm.value);
      data.style = 1;
      this.httpSer[this._id ? 'putApplyId' : 'addApply'](data).subscribe(({ code, message }) => {
        if (code) {
          this.router.navigate(['/project/platform'], { queryParams: { style: 1 }, queryParamsHandling: "merge" });
        } else {
          this.msg.error(message);
        }
      });
    }
  }

  // 获取路由
  private getRoute(): void {
    this.route.params.subscribe(({ _id }) => {
      this._id = _id;
      if (_id) { this.getApplyId(_id); }
    });
  }

  // 获取
  private getApplyId(id: string): void {
    this.httpSer.getApplyId(id).subscribe(({ code, result }) => {
      if (code) {
        this.isStore = true;
        this.applyData = result;
        let obj = { mold: result.mold, company: result.company, name: result.name, job: result.job, phone: result.phone, email: result.email, content: result.content, qq: result.qq };
        this.validateForm.setValue(obj);
      }
    });
  }

  // 重置表单
  public reset() {
    let obj = { mold: 0, company: '', name: '', job: '', phone: '', email: '1', content: '', qq: '' };
    this.validateForm.setValue(obj);
  }

  // 取消使用缓存
  public handleCancel(): void {
    this.isVisible = false;
    this.isStore = true;
    store.remove("apply");
  }

  // 确认使用缓存
  public handleOk(): void {
    const apply: any = store.get("apply");
    this.isStore = true;
    !!apply && this.validateForm.setValue(apply);
    store.remove("apply");
    this.isVisible = false;
  }
}
