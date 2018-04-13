import { Component, ViewChild, Input, Output, OnChanges, ViewEncapsulation, EventEmitter } from '@angular/core';

@Component({
  selector: "tag-lists",
  templateUrl: "./lists.html",
  styleUrls: ['./lists.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class ListsComponent {
  @Input() tags: any
  @Input() pagination: any;
  @Output() editTag = new EventEmitter(); // 编辑对象事件
  @Output() topTag = new EventEmitter(); // 置顶事件
  @Output() removeTagId = new EventEmitter(); // 删除事件
  @Output() pageTags = new EventEmitter(); // 分页事件

  constructor() { }

  // 编辑
  public editorTagId(id: string) {
    this.editTag.emit(id);
  }

  // 置顶操作
  public topOption(ids: Array<string>, top: number | boolean): void {
    let parmas: any = {};
    if (typeof (top) === 'boolean') {
      parmas.enable = top;
    } else {
      parmas.top = top
    }
    this.topTag.emit({ ids: ids, ...parmas });
  }

  // 删除操作
  public removeTag(id: string): void {
    this.removeTagId.emit(id);
  }

  // public refreshStatus() {

  // }
  // public displayDataChange() {

  // }

  public asd(page:number) {
    this.pageTags.emit(page);
  }
}