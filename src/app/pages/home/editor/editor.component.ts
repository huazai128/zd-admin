import { Component, ElementRef, SimpleChanges, OnChanges, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { NewsEditorServier } from './editor.servier';
import { debounceTime } from 'rxjs/operators';
import { store } from "@store/store";
import { API_ROOT } from '@config';

@Component({
  selector: "app-home",
  templateUrl: './editor.html',
  styleUrls: ['./editor.scss'],
  providers: [NzMessageService, NewsEditorServier]
})
export class EditorComponent implements OnChanges, OnInit {
  public validateForm: FormGroup;
  public loading: boolean = false;
  public avatarUrl: string; // pc
  public mAvatarUrl: string; // 移动端
  private imgUrl: string;
  private mImgUrl: string;
  public imgRoot: string = API_ROOT;
  public imgUplaod = `${API_ROOT}/image`; // 图片上传接口
  public news_id: string; // 当前路由id
  public newsData = {}; // 用于存储当前ID下的数据
  public staetTime = new Date();
  public isVisible: boolean = false; // 是否显示对话框
  private isStore: boolean = false;
  public options = [
    { value: 1, label: '公司动态' },
    { value: 2, label: '行业新闻' },
    { value: 3, label: '科技资讯' }
  ]
  public headers = {
    "Authorization": 'Bearer ' + localStorage.getItem('id_token')
  }
  constructor(private fb: FormBuilder,
    private msg: NzMessageService,
    private el: ElementRef,
    private newsSer: NewsEditorServier,
    private route: ActivatedRoute,
    private router: Router) { }

  // 初始化数据
  ngOnInit() {
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      summary: [null, [Validators.required]],
      column: [1, [Validators.required]],
      origin: [null, [Validators.required]],
      sort: [1, [Validators.required]],
      auth: ['', [Validators.required]],
      time: ['', [Validators.required]],
      content: ['', [Validators.required]]
    });
    if (!!store.get("news") || !!store.get("imgs")) {
      this.isVisible = true;
    }
    // 监听输入框的变化
    this.validateForm.valueChanges.pipe(
      debounceTime(300)
    ).subscribe((res) => {
      !this.isStore && store.set("news", res);
    })
    this.getRouterId();
  }

  // 监听双向数据绑定的变化；
  ngOnChanges(change: any) {
    console.log(change);
  }
  
  // 提交表单
  public submitForm() {
    if (this.validateForm.valid) {
      let data = Object.assign(this.validateForm.value, { url: this.imgUrl, murl: this.mImgUrl });
      this.newsSer[(<any>this.newsData)._id ? 'putNews' : 'addNews'](Object.assign(this.newsData, data)).subscribe(({ code, message }) => {
        if (code) {
          this.reset();
          store.remove("news");
          store.remove("imgs");
          this.router.navigateByUrl("/home/lists");
        } else {
          this.msg.info(message);
        }
      })
    }
  }

  // 取消使用缓存 
  public handleCancel(): void {
    this.isVisible = false;
    this.isStore = true;
    this.avatarUrl = '';
    this.mAvatarUrl = '';
    this.imgUrl = '';
    this.mImgUrl = '';
    store.remove("news");
    store.remove("imgs");
  }

  // 确认使用缓存
  public handleOk(): void {
    const news = store.get("news");
    const imgs = store.get("imgs")
    this.isStore = true;
    !!news && this.validateForm.setValue(news);
    if (!!imgs) {
      this.avatarUrl = imgs.avatarUrl;
      this.mAvatarUrl = imgs.mAvatarUrl;
      this.imgUrl = imgs.imgUrl;
      this.mImgUrl = imgs.mImgUrl;
      store.remove("imgs");
    }
    store.remove("news");
    this.isVisible = false;
  }

  // 获取路由上的参数
  public getRouterId() {
    this.route.params.subscribe(({ _id }) => {
      this.news_id = _id;
      if (_id) this.getNewsId(_id);
    });
  }

  // 获取当前广告位
  public getNewsId(id: string) {
    this.newsSer.getNews(id).subscribe(({ result }) => {
      this.newsData = result;
      this.validateForm.setValue({ 'title': result.title, 'summary': result.summary, 'sort': result.sort, 'column': result.column, 'origin': result.origin, 'auth': result.auth, 'time': result.time, 'content': result.content });
      this.avatarUrl = this.imgRoot + result.url;
      this.imgUrl = result.url;
      this.mAvatarUrl = this.imgRoot + result.murl;
      this.mImgUrl = result.murl;
    })
  }

  // 重置表单
  public reset() {
    this.validateForm.setValue({ title: '', summary: '', column: 1, origin: '', sort: 1, auth: '', time: new Date(), content: '' }); // 重置表单
    this.avatarUrl = '';
    this.mAvatarUrl = '';
    this.imgUrl = '';
    this.mImgUrl = '';
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
        this.imgUrl = info.file.response.result.path;
        store.set("imgs", Object.assign(imgs, { imgUrl: this.imgUrl }))
      } else {
        this.mImgUrl = info.file.response.result.path;
        store.set("imgs", Object.assign(imgs, { mImgUrl: this.mImgUrl }))
      }
      this.msg.info(info.file.response.message);
    }
  }
}