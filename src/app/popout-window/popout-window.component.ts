import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  HostListener,
  Injector, Input,
  ViewChild
} from '@angular/core';
import {CdkPortal, CdkPortalOutlet, DomPortalOutlet} from '@angular/cdk/portal';

@Component({
  selector: 'app-popout-window',
  template: `
    <ng-content *cdkPortal></ng-content>
    <ng-container *cdkPortalOutlet></ng-container>
  `
})

export class PopoutWindowComponent implements AfterViewInit {
  @ViewChild(CdkPortal) portal: CdkPortal;
  @ViewChild(CdkPortalOutlet) portalOutlet: CdkPortalOutlet;

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
    this.doPopIn();
  }

  public doPopIn(): void {
    if (!this.portalOutlet.hasAttached()) {
      this.portalOutlet.attach(this.portal);
    }

    if (this.externalWindow) {
      this.externalWindow.close();
      this.externalWindow = null;
    }

  }

  public doPopOut(): void {
    if (!this.externalWindow) {
      const elmRect = this.portal.templateRef.elementRef.nativeElement.nextElementSibling.getBoundingClientRect();

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
        this.doPopIn();
      });
    } else {
      this.externalWindow.focus();
    }
  }
}
