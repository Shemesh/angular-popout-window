import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  HostListener,
  Injector,
  Input,
  ViewChild
} from '@angular/core';
import {CdkPortal, CdkPortalOutlet, DomPortalOutlet} from '@angular/cdk/portal';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'popout-window',
  template: `
    <ng-content *cdkPortal></ng-content>
    <div #innerOutletWrapper style="width: 100%; height: 100%; overflow: auto;">
      <ng-container *cdkPortalOutlet></ng-container>
    </div>
  `
})

export class PopoutWindowComponent implements AfterViewInit {
  @ViewChild(CdkPortal) portal: CdkPortal;
  @ViewChild(CdkPortalOutlet) portalOutlet: CdkPortalOutlet;
  @ViewChild('innerOutletWrapper') innerOutletWrapper: ElementRef;

  @Input() windowWidth: number;
  @Input() windowHeight: number;
  @Input() windowLeft: number;
  @Input() windowTop: number;

  private externalWindow: Window;

  @HostListener('window:unload')
  private unloadHandler(): void {
    if (this.externalWindow) {
      this.externalWindow.close();
      this.externalWindow = null;
    }
  }

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector
  ) {}

  ngAfterViewInit(): void {
    this.popIn();
  }

  public popIn(): void {
    if (!this.portalOutlet.hasAttached()) {
      this.portalOutlet.attach(this.portal);
    }

    if (this.externalWindow) {
      this.externalWindow.close();
      this.externalWindow = null;
    }

  }

  public popOut(): void {
    if (!this.externalWindow) {
      const elmRect = this.innerOutletWrapper.nativeElement.getBoundingClientRect();

      const navHeight = window.outerHeight - window.innerHeight;
      const navWidth = window.outerWidth - window.innerWidth;

      const winLeft = this.windowLeft || window.screenX + navWidth + elmRect.left;
      const winTop = this.windowTop || window.screenY + navHeight + elmRect.top;

      this.externalWindow = window.open(
        '',
        'appPopoutWindow',
        `width=${this.windowWidth > 99 ? this.windowWidth : elmRect.width},
        height=${this.windowHeight > 99 ? this.windowHeight : elmRect.height + 1},
        left=${winLeft},
        top=${winTop}`
      );
      this.externalWindow.document.body.style.margin = '0';

      if (!this.windowTop) {
        setTimeout(() => {
          this.externalWindow.moveBy(0, this.externalWindow.innerHeight - this.externalWindow.outerHeight);
        }, 50);
      }

      document.querySelectorAll('link, style').forEach(htmlElement => {
        this.externalWindow.document.head.appendChild(htmlElement.cloneNode(true));
      });

      const host = new DomPortalOutlet(
        this.externalWindow.document.body,
        this.componentFactoryResolver,
        this.applicationRef,
        this.injector
      );
      if (this.portalOutlet.hasAttached()) {
        this.portalOutlet.detach();
      }
      host.attach(this.portal);

      this.externalWindow.addEventListener('unload', () => {
        this.popIn();
      });
    } else {
      this.externalWindow.focus();
    }
  }
}
