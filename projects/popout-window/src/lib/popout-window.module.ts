import { NgModule } from '@angular/core';
import { PopoutWindowComponent } from './popout-window.component';
import {PortalModule} from '@angular/cdk/portal';

@NgModule({
  declarations: [PopoutWindowComponent],
    imports: [
        PortalModule
    ],
  exports: [PopoutWindowComponent]
})
export class PopoutWindowModule { }
