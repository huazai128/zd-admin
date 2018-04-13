import { Component, ViewEncapsulation, } from '@angular/core';
import { TagService } from './tag.service';

@Component({
  selector: "app-tag",
  templateUrl: "./tag.html",
  encapsulation: ViewEncapsulation.None,
  providers: [TagService]
})

export class TagComponent {

  public editTag: any; // 保存当前tag
  public isVisible: boolean = false;
  public tags = []; // 缓存所有tag集合
  public pagination = {};
  public tagId:string;

  constructor(private tagSer: TagService) { }

  // 初始化
  ngOnInit() {
    this.getTags();
  }

  // 新增标签
  public addTag(data) {
    this.tagSer.addTag(data).subscribe((res) => {
      this.editTag = null;
      this.getTags();
    })
  }

  // 获取数据
  public getTags(params: any = {}) {
    this.tagSer.getLists(params).subscribe(({ code, result }) => {
      if (code) {
        this.tags = result.data;
        this.pagination = result.pagination;
      }
    })
  }

  // 获取编辑信息
  public _editTag(id: string) {
    this.tagSer.getTagId(id).subscribe(({ code, result }) => {
      this.editTag = result;
    })
  }

  // 修改编辑信息
  public putTag(data) {
    this.tagSer.putTagId(Object.assign(this.editTag, data)).subscribe(({ code, result }) => {
      if (code) {
        this.editTag = null;
        this.getTags();
      }
    })
  }

  // 重置表单
  public resetTag(): void {
    this.editTag = null;
  }

  // 置顶操作
  public _topTag(data: any = {}): void {
    console.log(data)
    this.tagSer.moveState(data).subscribe(({ code }) => {
      if (code) this.getTags();
    })
  }

  // 删除操作
  public _removeTagId(id): void {
    this.isVisible = true;
    this.tagId = id;
  }

  // 确认删除
  public handleOk(): void {
    this.tagSer.deleteTagId(this.tagId).subscribe(({ code }) => {
      if(code) this.getTags();
      this.isVisible = false;
    })
  }

  // 取消删除
  public handleCancel():void{
    this.isVisible = false;
    this.tagId = '';
  }

  // 分页操作
  public _pageTags(page:number){
    this.getTags({page: page})
  }
}