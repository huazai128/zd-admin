import { Component, Input, Output, OnChanges, ViewEncapsulation, EventEmitter,SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: "ky-editor",
  templateUrl: "./editor.html",
  styleUrls:['./editor.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class EditorComponent {
  @Input() ky:any; //
  @Output() kyChange:EventEmitter<any> = new EventEmitter(); // 
  @Output() submitKy:EventEmitter<any> = new EventEmitter(); //  提交事件
  @Output() resetKy:EventEmitter<any> = new EventEmitter(); //  提交事件

  public validateForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  // 提交表单
  public submitForm() {
    if(this.validateForm.valid){
      this.submitKy.emit(this.validateForm.value); 
      this.onReset();
    }
  }

  // 重置
  public onReset(){
    this.validateForm.reset({name:''});
    this.resetKy.emit();
  }

  // 监听数据变化
  ngOnChanges(changes:SimpleChanges){
    const ky = !!changes.ky && !!changes.ky.currentValue;  // !! 强制类型转换
    if(ky){
      this.validateForm.reset(changes.ky.currentValue);
    }
  }
} 