import { Component, ViewEncapsulation } from '@angular/core';
import { PlanService } from '../plan.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "apply-detail",
  templateUrl: "./detail.html",
  styleUrls: ['./detail.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [PlanService]
})

export class PlanDetailComponent {
  public detail: any;
  private _id: string;
  constructor(private httpSer: PlanService, private route: ActivatedRoute) {
    this.route.params
  }

  ngOnInit(){
    this.getRoute();
  }

  private getDetail(id): void {
    this.httpSer.getPlanId(id).subscribe(({ code, result }) => {
      this.detail = result;
    })
  }

  // 获取路由
  private getRoute(): void {
    this.route.params.subscribe(({ _id }) => {
      this._id = _id;
      if (_id) this.getDetail(_id);
    })
  }
}