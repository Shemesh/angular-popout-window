import {ApplicationRef, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  private showPopOutP = false;
  get showPopOut(): boolean {
    return this.showPopOutP;
  }

  set showPopOut(value: boolean) {
    this.showPopOutP = value;
  }
  public someJah = '321';

  constructor(private appRef: ApplicationRef) { }

  ngOnInit(): void {
  }


}
