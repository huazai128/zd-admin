import { Component,ViewEncapsulation,Input } from "@angular/core"

@Component({
  selector:"ba-card",
  templateUrl:"./baCard.html",
  styleUrls:["./baCard.scss"],
  encapsulation:ViewEncapsulation.None
})
export class BaCardComponent{
  @Input() title:string;
  @Input() baCardClass:string;
  @Input() selectType:string;
  ngOnInit(){
  }
}
