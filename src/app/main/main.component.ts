import {ApplicationRef, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public someJah = '321';

  constructor(private appRef: ApplicationRef) { }

  ngOnInit(): void {
  }


}
