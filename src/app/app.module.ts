import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MainComponent } from './main/main.component';
import { PopoutWindowComponent } from './popout-window/popout-window.component';
import {FormsModule} from '@angular/forms';
import {PortalModule} from '@angular/cdk/portal';
import { NgStartComponent } from './ng-start/ng-start.component';

@NgModule({
  declarations: [
    MainComponent,
    PopoutWindowComponent,
    NgStartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    PortalModule
  ],
  providers: [],
  bootstrap: [MainComponent]
})
export class AppModule { }
