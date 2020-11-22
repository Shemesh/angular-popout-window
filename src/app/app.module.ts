import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MainComponent } from './main/main.component';
import {FormsModule} from '@angular/forms';
import { NgStartComponent } from './ng-start/ng-start.component';
import {PopoutWindowModule} from '../../projects/popout-window/src/lib/popout-window.module';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    MainComponent,
    NgStartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    PopoutWindowModule,
    DragDropModule,
  ],
  providers: [],
  bootstrap: [MainComponent]
})
export class AppModule { }
