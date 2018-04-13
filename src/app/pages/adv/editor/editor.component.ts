import { Component,OnChanges,SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { API_ROOT } from '@config';
import { AdvEditorServier } from './editor.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: "adv-editor",
  templateUrl: './editor.html',
  styleUrls: ['./editor.scss'],
  providers: [AdvEditorServier]
})

export class AdvEditorComponent implements OnChanges{

  public validateForm: FormGroup;
  public loading: boolean = false;
  public avatarUrl: string; // pc
  public mAvatarUrl: string; // 移动端
  private imgUrl: string;
  private mImgUrl: string;
  public imgRoot: string = API_ROOT;
  public imgUplaod = `${API_ROOT}/image`; // 图片上传接口
  public adv_id: string; // 当前路由id
  public advData = {};
  public headers = {
    "Authorization": 'Bearer ' + localStorage.getItem('id_token')
  }

  constructor(private fb: FormBuilder, private router: Router, private msg: NzMessageService, private editorSer: AdvEditorServier, private route: ActivatedRoute) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      title: ["", [Validators.required]],
      link: [""],
      yurl: [""],
      sort: [1, [Validators.required]],
    });
    this.getRouterId();
  }

  // 提交按钮
  submitForm() {
    if (this.validateForm.valid) {
      if (this.imgUrl) {
        let data = Object.assign(this.validateForm.value, { url: this.imgUrl,murl:this.mImgUrl });
        this.editorSer[(<any>this.advData)._id ? 'putAdv' : 'addAdv'](Object.assign(this.advData, data)).subscribe(({ code, message }) => {
          if (code) {
            this.validateForm.reset(); // 重置表单
            this.avatarUrl = '';
            this.mAvatarUrl = '';
            this.imgUrl = '';
            this.mImgUrl = '';
            this.router.navigateByUrl("/adv/lists");
          } else {
            this.msg.info(message);
          }
        })
      } else {
        this.msg.info('请选择上传图片!');
      }
    }
  }

  // 
  ngOnChanges(changs:SimpleChanges){

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
  handleChange(info: { file: UploadFile },type:number) {
    if (info.file.status === 'uploading') {
      this.loading = true;
      return;
    }
    if (info.file.status === 'done') {
      this.getBase64(info.file.originFileObj, (img: any) => {
        this.loading = false;
        if(Object.is(type,1)){
          this.avatarUrl = img;
        }else{
          this.mAvatarUrl = img;
        }
        
      });
    }
    if (!!info.file.response && info.file.response.code) {
      if(Object.is(type,1)){
        this.imgUrl = info.file.response.result.path;
      }else{
        this.mImgUrl = info.file.response.result.path;;
      }
      this.msg.success(info.file.response.message);
    }
  }

  // 获取路由上的参数
  getRouterId() {
    this.route.params.subscribe(({ _id }) => {
      this.adv_id = _id;
      if (_id) this.getAdv(_id);
    });
  }
  // 获取当前广告位
  getAdv(id: string) {
    this.editorSer.getAdv(id).subscribe(({ result }) => {
      this.advData = result;
      this.validateForm.setValue({ 'title': result.title, 'link': result.link, 'sort': result.sort });
      this.avatarUrl = this.imgRoot + result.url;
      this.mAvatarUrl = this.imgRoot + result.murl;
      this.imgUrl = result.url;
      this.mImgUrl = result.murl;
    })
  }
}