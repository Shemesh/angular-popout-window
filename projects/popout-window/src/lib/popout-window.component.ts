import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  HostListener,
  Injector,
  Input, OnDestroy,
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

export class PopoutWindowComponent implements AfterViewInit, OnDestroy  {

  @ViewChild(CdkPortal) private portal: CdkPortal;
  @ViewChild(CdkPortalOutlet) private portalOutlet: CdkPortalOutlet;
  @ViewChild('innerOutletWrapper') private innerOutletWrapper: ElementRef;

  @Input() windowWidth: number;
  @Input() windowHeight: number;
  @Input() windowLeft: number;
  @Input() windowTop: number;
  @Input() windowTitle: string;
  @Input() windowStyle: string;
  @Input() windowStyleUrl: string;
  @Input() suppressCloneStyles = false;
  @Input() get isPoppedOut(): boolean {
    return this.isOut;
  }

  private popoutWindow: Window;
  private isOut = false;

  @HostListener('window:beforeunload')
  private beforeunloadHandler(): void {
    this.close();
  }

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector
  ) {}

  ngAfterViewInit(): void {
    this.popIn();
  }

  ngOnDestroy(): void {
    this.close();
  }

  private close(): void {
    if (this.popoutWindow) {
      this.popoutWindow.close();
      this.popoutWindow = null;
      this.isOut = false;
    }
  }

  public popIn(): void {
    if (!this.portalOutlet.hasAttached()) {
      this.portalOutlet.attach(this.portal);
    }

    this.close();
  }

  public popOut(): void {
    if (!this.popoutWindow) {
      const elmRect = this.innerOutletWrapper.nativeElement.getBoundingClientRect();

      const navHeight = window.outerHeight - window.innerHeight;
      const navWidth = window.outerWidth - window.innerWidth;

      const winLeft = this.windowLeft || window.screenX + navWidth + elmRect.left;
      const winTop = this.windowTop || window.screenY + navHeight + elmRect.top;

      this.popoutWindow = window.open(
        '',
        `popoutWindow${Date.now()}`,
        `width=${this.windowWidth > 99 ? this.windowWidth : elmRect.width},
        height=${this.windowHeight > 99 ? this.windowHeight : elmRect.height + 1},
        left=${winLeft},
        top=${winTop}`
      );

      this.popoutWindow.document.title = this.windowTitle ? this.windowTitle : window.document.title;
      this.popoutWindow.document.body.style.margin = '0';

      if (!this.suppressCloneStyles) {
        document.head.querySelectorAll('style').forEach(node => {
          this.popoutWindow.document.head.appendChild(node.cloneNode(true));
        });

        document.head.querySelectorAll('link[rel="stylesheet"]').forEach(node => {
          this.popoutWindow.document.head.insertAdjacentHTML('beforeend',
            `<link rel="stylesheet" type="${(node as HTMLLinkElement).type}" href="${(node as HTMLLinkElement).href}">`);
        });

        (document as any).fonts.forEach(node => {
          (this.popoutWindow.document as any).fonts.add(node);
        });
      }

      if (this.windowStyleUrl) {
        this.popoutWindow.document.head.insertAdjacentHTML('beforeend',
          `<link rel="stylesheet" type="text/css" href="${window.location.origin}/${this.windowStyleUrl}">`);
      }

      if (this.windowStyle) {
        this.popoutWindow.document.head.insertAdjacentHTML('beforeend', `<style>${this.windowStyle}</style>`);
      }

      // if (!this.windowTop) {
      //   setTimeout(() => {
      //     this.popoutWindow.moveBy(this.popoutWindow.innerWidth - this.popoutWindow.outerWidth,
      //       this.popoutWindow.innerHeight - this.popoutWindow.outerHeight);
      //   }, 50);
      // }

      const host = new DomPortalOutlet(
        this.popoutWindow.document.body,
        this.componentFactoryResolver,
        this.applicationRef,
        this.injector
      );
      if (this.portalOutlet.hasAttached()) {
        this.portalOutlet.detach();
      }
      host.attach(this.portal);
      this.isOut = true;

      this.popoutWindow.addEventListener('unload', () => {
        this.popIn();
      });
    } else {
      this.popoutWindow.focus();
    }
  }
}
