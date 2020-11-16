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
  @ViewChild(CdkPortal) portal: CdkPortal;
  @ViewChild('inPlace', { read: ElementRef }) inPlace: ElementRef;

  private externalWindow: Window;
  private inPlaceHost: DomPortalOutlet;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector
  ) {}

  ngAfterViewInit(): void {
    this.inPlaceHost = new DomPortalOutlet(
      this.inPlace.nativeElement,
      this.componentFactoryResolver,
      this.applicationRef,
      this.injector
    );
    this.doPopIn();
  }

  public doPopIn(): void {
    if (!this.inPlaceHost.hasAttached()) {
      this.inPlaceHost.attach(this.portal);
    }

    if (this.externalWindow) {
      this.externalWindow.close();
      this.externalWindow = null;
    }

  }

  public doPopOut(): void {
    if (!this.externalWindow) {
      if (this.inPlaceHost.hasAttached()) {
        this.inPlaceHost.detach();
      }

      this.externalWindow = window.open(
        '',
        'appPopoutWindow',
        'width=600,height=400,left=1200,top=100'
      );

      const host = new DomPortalOutlet(
        this.externalWindow.document.body,
        this.componentFactoryResolver,
        this.applicationRef,
        this.injector
      );
      host.attach(this.portal);

      this.externalWindow.addEventListener('unload', () => {
        this.doPopIn();
      });
    } else {
      this.externalWindow.focus();
    }
  }
}
