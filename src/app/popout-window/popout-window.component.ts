import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  HostListener,
  Injector,
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

      this.externalWindow = window.open(
        '',
        'appPopoutWindow',
        'width=600,height=400,left=1200,top=100'
      );

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
