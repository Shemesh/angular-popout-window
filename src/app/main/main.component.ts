import {ApplicationRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CdkDragMove} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  jahBless = 'Jah Bless';
  isChecked: any;
  private rect;

  @ViewChild('resizableDiv') resizableDiv: ElementRef;
  @ViewChild('resizer') resizer: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  resizerMoved(event: CdkDragMove): void {
    const newW = this.rect.width + event.distance.x;
    const newH = this.rect.height + event.distance.y;
    if (newW > 350) {
      this.resizableDiv.nativeElement.style.width = `${newW}px`;
    }
    if (newH > 300) {
      this.resizableDiv.nativeElement.style.height = `${newH}px`;
    }
    this.resizer.nativeElement.style.transform = `translate3d(0, 0, 0)`;
  }

  dragStart(): void {
    this.rect  = this.resizableDiv.nativeElement.getBoundingClientRect();
  }
}
