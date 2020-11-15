import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {CdkPortal, DomPortalOutlet} from '@angular/cdk/portal';

@Component({
  selector: 'app-popout-window',
  templateUrl: './popout-window.component.html',
  styleUrls: ['./popout-window.component.css'],
})

export class PopoutWindowComponent implements AfterViewInit {
  private popOut1: boolean;
  get popOut(): boolean {
    return this.popOut1;
  }
  @Input() set popOut(value: boolean) {
    this.popOut1 = value;
    if (value) {
      this.doPopOut();
    } else {
      this.doPopIn();
    }
    this.popOutChange.emit(value);
  }
  @Output() popOutChange = new EventEmitter<boolean>();
  @ViewChild(CdkPortal) portal: CdkPortal;
  @ViewChild('inPlace', { read: ElementRef }) inPlace: ElementRef;

  private externalWindow = null;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector
  ) {}

  ngAfterViewInit(): void {
    this.popOut = false;
  }

  private doPopIn(): void {
    if (!this.inPlace || !this.inPlace.nativeElement){
      return;
    }
    const inPlaceHost = new DomPortalOutlet(
      this.inPlace.nativeElement,
      this.componentFactoryResolver,
      this.applicationRef,
      this.injector
    );

    inPlaceHost.attach(this.portal);
    if (this.externalWindow) {
      this.externalWindow.close();
      this.externalWindow = null;
    }

  }

  private doPopOut(): void {
    if (!this.externalWindow) {
      this.externalWindow = window.open(
        '',
        'MyNameIs',
        'width=600,height=400,left=900,top=500'
      );
    }

    const host = new DomPortalOutlet(
      this.externalWindow.document.body,
      this.componentFactoryResolver,
      this.applicationRef,
      this.injector
    );

    host.attach(this.portal);

    this.externalWindow.addEventListener('beforeunload', () => {
      this.popOut = false;
    });
  }
}

