import { Component } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { ForumService } from '../forum.service';
import { store } from "@store/store";
import { API_ROOT } from '@config';
import { debounceTime } from 'rxjs/operators'

@Component({
  selector: 'forum-edtior',
  templateUrl: './editor.html',
  styleUrls: ["./edtior.scss"],
  providers: [ForumService]
})

export class EditorComponet {

  public validateForm: FormGroup;
  public isVisible: boolean = false;
  public loading: boolean = false;
  public forum_id: string;
  public categoryOptions = [
    { value: 0, label: '测试工具' },
    { value: 1, label: '知识库' }
  ]
  public tagsOptions: Array<any> = []; // 标签类数据
  public imgRoot: string = API_ROOT;  // 接口
  public imgUplaod = `${API_ROOT}/image`; // 图片上传接口
  public pc_img: string; // pc端图片
  public y_img: string; // 移动端图片
  public avatarUrl: string; // pc Bs64
  public mAvatarUrl: string; // 移动端 Bs64
  private isStore: boolean = false;
  public headers = {
    "Authorization": 'Bearer ' + localStorage.getItem('id_token')
  }
  public forumData: any = {}; // 用于存储

  constructor(private fb: FormBuilder,
    private editorSer: ForumService,
    private router: Router,
    private route: ActivatedRoute,
    private msg: NzMessageService, ) { }

  public ngOnInit() {
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      subtitle: [null, [Validators.required]],
      summary: [null, [Validators.required]],
      category: [0, [Validators.required]],
      tags: [[], [Validators.required]],
      status: ['1', [Validators.required]],
      content: ['', [Validators.required]],
      time: ['', [Validators.required]],
    });
    if (!!store.get("forum") || !!store.get("imgs")) {
      this.isVisible = true;
    }
    // 监听输入框的变化
    this.validateForm.valueChanges.pipe(
      debounceTime(300)
    ).subscribe((res) => {
      !this.isStore && store.set("forum", res);
    })
    this.getRoute();
    this.getTags();
  }

  // 表单提交
  public submitForm(): void {
    if (this.validateForm.valid) {
      let data = Object.assign(this.validateForm.value, { pc_img: this.pc_img, y_img: this.y_img });
      this.editorSer[this.forum_id ? 'putForumId' : 'addForum'](Object.assign(this.forumData, data)).subscribe(({ code, message }) => {
        if (code) {
          this.reset();
          store.remove("forum");
          store.remove("imgs");
          this.router.navigateByUrl("/forum/lists");
        } else {
          this.msg.error(message);
        }
      })
    }
  }

  // 获取所有标签
  public getTags(params: any = {}): void {
    params.enable = true;
    this.editorSer.getTags(params).subscribe(({ code, result }) => {
      if (code) {
        this.tagsOptions = result.data;
      }
    })
  }

  // 获取路由
  private getRoute(): void {
    this.route.params.subscribe(({ _id }) => {
      this.forum_id = _id;
      if (_id) this.getForumId(_id);
    })
  }

  // 获取当前编辑数据
  private getForumId(id): void {
    this.editorSer.getForumId(id).subscribe(({ code, result }) => {
      if (code) {
        this.isStore = true;
        this.forumData = result;
        let obj = { title: result.title, subtitle: result.subtitle, summary: result.summary, category: result.category, tags: result.tags, status: String(result.status), content: result.content, time: new Date() }
        this.validateForm.setValue(obj);
        this.avatarUrl = this.imgRoot + result.pc_img;
        this.pc_img = result.pc_img;
        this.mAvatarUrl = this.imgRoot + result.y_img;
        this.y_img = result.y_img;
      }
    })
  }

  // 重置表单
  public reset() {
    let obj = { title: '', subtitle: '', summary: '', category: 0, tags: '', status: '1', content: '', time: '' };
    this.validateForm.setValue(obj);
    this.avatarUrl = '';
    this.mAvatarUrl = '';
    this.pc_img = '';
    this.y_img = '';
  }

  // 取消使用缓存 
  public handleCancel(): void {
    this.isVisible = false;
    this.isStore = true;
    this.avatarUrl = '';
    this.mAvatarUrl = '';
    this.pc_img = '';
    this.y_img = '';
    store.remove("forum");
    store.remove("imgs");
  }

  // 确认使用缓存
  public handleOk(): void {
    const forum = store.get("forum");
    const imgs = store.get("imgs")
    this.isStore = true;
    !!forum && this.validateForm.setValue(forum);
    if (!!imgs) {
      this.avatarUrl = imgs.avatarUrl;
      this.mAvatarUrl = imgs.mAvatarUrl;
      this.pc_img = imgs.imgUrl;
      this.y_img = imgs.mImgUrl;
      store.remove("imgs");
    }
    store.remove("forum");
    this.isVisible = false;
  }

  // 文件上传
  beforeUpload = (file: File) => {
    let types = ['jpeg', 'png', 'jpg'];
    const isType = types.includes(file.type.split('/')[1]);
    if (!isType) {
      this.msg.error('请选择图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.msg.error('最大文件上传2MB!');
    }
    return isType && isLt2M;
  }

  // 图片Base64处理
  private getBase64(img: File, callback: (img: any) => void) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  // 监听文件改变
  handleChange(info: { file: UploadFile }, type: number) {
    if (info.file.status === 'uploading') {
      this.loading = true;
      return;
    }
    let imgs = Object.assign(store.get("imgs") || {})
    if (info.file.status === 'done') {
      this.getBase64(info.file.originFileObj, (img: any) => {
        this.loading = false;
        if (Object.is(type, 1)) {
          this.avatarUrl = img;
          store.set("imgs", Object.assign(imgs, { avatarUrl: img }))
        } else {
          this.mAvatarUrl = img;
          store.set("imgs", Object.assign(imgs, { mAvatarUrl: img }))
        }
      });
    }
    if (!!info.file.response && info.file.response.code) {
      if (Object.is(type, 1)) {
        this.pc_img = info.file.response.result.path;
        store.set("imgs", Object.assign(imgs, { pc_img: this.pc_img }))
      } else {
        this.y_img = info.file.response.result.path;
        store.set("imgs", Object.assign(imgs, { y_img: this.y_img }))
      }
      this.msg.info(info.file.response.message);
    }
  }
}