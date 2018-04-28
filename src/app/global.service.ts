import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GlobalSeriver {
  public emitter: Subject<any> = new Subject<any>();

  public set(data: any) {
    this.emitter.next(data);
  }

}