import { Component, Input, Output, OnChanges, ViewEncapsulation, EventEmitter, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: "tag-editor",
  templateUrl: "./editor.html",
  styleUrls: ['./editor.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class EditorComponent {
  @Input() tag: any; //
  @Output() tagChange: EventEmitter<any> = new EventEmitter();
  @Output() submitTag: EventEmitter<any> = new EventEmitter(); //  提交事件
  @Output() resetTag: EventEmitter<any> = new EventEmitter(); //  提交事件

  public validateForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      enable: [true, [Validators.required]],
    });
  }

  // 提交表单
  public submitForm() {
    if (this.validateForm.valid) {
      this.submitTag.emit(this.validateForm.value);
      this.onReset();
    }
  }

  // 重置
  public onReset() {
    this.validateForm.reset({ name: '', enable: false });
    this.resetTag.emit();
  }

  // 监听数据变化
  ngOnChanges(changes: SimpleChanges) {
    const tag = !!changes.tag && !!changes.tag.currentValue;  // !! 强制类型转换
    if (tag) {
      this.validateForm.reset(changes.tag.currentValue);
    }
  }
}