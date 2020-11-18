import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MainComponent } from './main/main.component';
import {FormsModule} from '@angular/forms';
import { NgStartComponent } from './ng-start/ng-start.component';
import {PopoutWindowModule} from '../../projects/popout-window/src/lib/popout-window.module';

@NgModule({
  declarations: [
    MainComponent,
    NgStartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    PopoutWindowModule
  ],
  providers: [],
  bootstrap: [MainComponent]
})
export class AppModule { }
