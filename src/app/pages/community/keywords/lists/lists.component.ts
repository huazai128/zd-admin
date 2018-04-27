import { Component, ViewChild, Input, Output, OnChanges, ViewEncapsulation, EventEmitter, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

@Component({
  selector: "ky-lists",
  templateUrl: "./lists.html",
  styleUrls: ['./lists.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class KyListsComponent {
  public state = "all";
  public modeState = "all";
  public allChecked: boolean = false;
  public ids: Array<string> = [];
  public isDisabled: boolean = true;
  public indeterminate: boolean = false;
  public searTeams = new Subject<string>();
  public stateOptions = [
    { value: 0, label: '快速发布' },
    { value: -1, label: '快速删除' },
  ]
  @Input() kys: any = [];
  @Input() isLoading;
  @Input() pagination: any;
  @Output() editKy = new EventEmitter(); // 编辑对象事件
  @Output() topKy = new EventEmitter(); // 置顶事件
  @Output() stateKy = new EventEmitter(); // 删除事件
  @Output() pageKys = new EventEmitter(); // 分页事件
  @Output() changeState = new EventEmitter(); // 分页事件
  @Output() moveStateChange = new EventEmitter(); // 分页事件
  @Output() kySearch = new EventEmitter(); // 分页事件

  constructor() { }

  // 初始化
  ngOnInit() {
    setTimeout(() => {
      this.isDisabled = false;
    }, 0);
    this.searTeams.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((res) => {
      this.kySearch.emit(res);
    })
  }

  // 编辑
  public editorKyId(id: string) {
    this.editKy.emit(id);
  }

  // 置顶操作
  public topOption(ids: Array<string>, top: number | boolean): void {
    let parmas: any = {};
    if (typeof (top) === 'boolean') {
      parmas.enable = top;
    } else {
      parmas.top = top
    }
    this.topKy.emit({ ids: ids, ...parmas });
  }

  // 状态操作
  public stateChange(ids: Array<string>, active: number): void {
    this.stateKy.emit({ ids: ids, active: active });
  }

  // 分页
  public asd(page: number) {
    this.pageKys.emit(page);
  }

  // 修改状态
  public moveState(value): void {
    this.moveStateChange.emit({ ids: this.ids, active: value });
    this.ids = [];
    this.indeterminate = false;
    this.allChecked = false;
    this.isDisabled = false;
  }

  // 搜索
  public getKeyword(value): void {
    this.searTeams.next(value)
  }

  // 状态更改
  public switchState(value): void {
    this.state = value;
    this.allChecked = false;
    this.ids = [];
    this.changeState.next(value);
  }

  // 自由选择
  public refreshStatus(): void {
    const allChecked = this.kys.every((item) => item.checked === true);
    const allUnChecked = this.kys.every(item => !item.checked);
    this.ids = [];
    this.kys.forEach((item) => {
      item.checked && this.ids.push(item._id);
    })
    if (!!this.ids.length) {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
    this.kys.length && (this.allChecked = allChecked);
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  // 全选
  public checkAll(value): void {
    this.kys.forEach((item) => {
      item.checked = value;
      value && this.ids.push(item._id);
      !value && (this.ids = []);
    });
    value && (this.isDisabled = true);
    !value && (this.isDisabled = false);
  }
}