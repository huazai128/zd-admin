import { Directive, ElementRef, HostListener, HostBinding } from "@angular/core";

import { BaCardService } from "./baCard.service";
import { BaMetrics } from "./baMetries";

@Directive({
  selector: '[baCardBlur]',
  providers: [BaCardService]
})

export class BaCardDirective {

  @HostBinding("class.card-blur") isEnabled: boolean = false;

  private _bodyBgSize: BaMetrics; // bg的大小参数

  constructor(private _el: ElementRef, private _service: BaCardService) {

  }

  // 监听浏览器的变化
  @HostListener("window:resize")
  public _onWindowResize(): void {
    if (this._isEnabled()) {
      this._bodyBgSize = this._service.getBodyBgImageSizes(); // 获取bg样式参数
      this._recalculateCardStyle();
    }
  }

  // 加载image的size参数
  private _getBodyImageSizesOnBgLoad(): void {
    // 订阅
    this._service.bodyBgLoad().subscribe(() => {  // 获取next传递的数据
      this._bodyBgSize = this._service.getBodyBgImageSizes();
    })
  }

  //
  private _recalculateCardStylesOnBgLoad(): void {
    this._service.bodyBgLoad().subscribe(() => {
      setTimeout(this._recalculateCardStyle.bind(this));
    })
  }

  private _recalculateCardStyle(): void {
    if (!this._bodyBgSize) {
      return;
    }
    this._el.nativeElement.style.backgroundSize = Math.round(this._bodyBgSize.width) + 'px ' + Math.round(this._bodyBgSize.height) + 'px';
    this._el.nativeElement.style.backgroundPosition = Math.floor(this._bodyBgSize.positionX) + 'px ' + Math.floor(this._bodyBgSize.positionY) + 'px';
  }

  private _isEnabled() {
  }
}
