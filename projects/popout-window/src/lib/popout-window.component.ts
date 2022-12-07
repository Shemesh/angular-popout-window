import {
  Component,
  ElementRef,
  HostListener,
  Input, EventEmitter, OnDestroy, Output, Renderer2,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'popout-window',
  template: `
    <div #innerWrapper style="width: 100%; height: 100%; overflow: auto;">
      <ng-content></ng-content>
    </div>
  `
})

export class PopoutWindowComponent implements OnDestroy  {

  @ViewChild('innerWrapper') private innerWrapper: ElementRef;

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
  @Output() closed: EventEmitter<boolean> = new EventEmitter();

  private popoutWindow: Window;
  private isOut = false;
  private observer: MutationObserver;

  @HostListener('window:beforeunload')
  private beforeunloadHandler(): void {
    this.close();
  }

  constructor(
    private renderer2: Renderer2,
    private elementRef: ElementRef
  ) {}

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.close();
  }

  private close(): void {
    if (this.popoutWindow) {
      this.popoutWindow.close();
      this.popoutWindow = null;
      this.isOut = false;
      this.closed.next(true);
    }
  }

  public popIn(): void {
    this.renderer2.appendChild(this.elementRef.nativeElement, this.innerWrapper.nativeElement);
    this.close();
  }

  public popOut(): void {
    if (!this.popoutWindow) {
      const elmRect = this.innerWrapper.nativeElement.getBoundingClientRect();

      const navHeight = window.outerHeight - window.innerHeight;
      const navWidth = window.outerWidth - window.innerWidth;

      const winLeft = this.windowLeft || window.screenX + navWidth + elmRect.left;
      const winTop = this.windowTop || window.screenY + navHeight + elmRect.top - 60;

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

        this.observeStyleChanges();

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

      this.renderer2.appendChild(this.popoutWindow.document.body, this.innerWrapper.nativeElement);
      this.isOut = true;

      this.popoutWindow.addEventListener('unload', () => {
        this.popIn();
      });
    } else {
      this.popoutWindow.focus();
    }
  }

  private observeStyleChanges(): void {
    const docHead = document.querySelector('head');

    this.observer?.disconnect();
    this.observer = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach((mutation: MutationRecord) => {
        mutation.addedNodes.forEach((node: Node) => {
          if (node.nodeName === 'STYLE') {
            this.popoutWindow.document.head.appendChild(node.cloneNode(true));
          }
        });
      });
    });

    this.observer.observe(docHead, { childList: true });
  }
}
