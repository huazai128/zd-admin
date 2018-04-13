import { Component, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { CommunityService } from '../community.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "community-detail",
  templateUrl: "./detail.html",
  styleUrls: ['./detail.scss'],
  encapsulation: ViewEncapsulation.Native,
})

export class DetailComponent {

  private id: string; // 当前文章id
  public community: any = {};
  public tui: Array<any> = [];
  
  public categoryOptions = [
    { value: 'all', label: "无" },
    { value: "choice", label: "精选话题" },
    { value: "recommend", label: "版主推荐" },
  ]
  public getParams = {
    state: "all"
  }


  constructor(private httpSer: CommunityService, private route: ActivatedRoute) {
    this.route.params.subscribe(({ _id }) => {
      this.id = _id;
    })
  }

  ngOnInit() {
    this.getCommunityId();
  }

  ngOnChanges(changes:SimpleChanges) {
  }

  // 获取详情
  public getCommunityId(): void {
    this.httpSer.getCommunityId(this.id).subscribe(({ result, code }) => {
      if (code) {
        this.community = result;
      }
    });
  }

  // 批量操作方法
  private moveOptions(ids, value): void {
    this.httpSer.moveState(ids, value).subscribe((res) => {
      this.getCommunityId();
    });
  }

  // 操作
  public singleState(ids: Array<string>, active: number) {
    this.moveOptions(ids, active);
  }

  // 精选
  public checkChioce(value, _id): void {
    const choice = value ? 1 : 0;
    this.httpSer.putCommunityId({ choice: choice, _id: _id }).subscribe((res) => {
      this.getCommunityId();
    })
  }

  // 推荐
  public checkRecommend(value, _id): void {
    const recommend = value ? 1 : 0;
    this.httpSer.putCommunityId({ recommend: recommend, _id: _id }).subscribe((res) => {
      this.getCommunityId();
    })
  }

}