import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1, Person } from '../pages/page1/page1';
import { Page2, Conversation } from '../pages/page2/page2';
import {You} from '../pages/page3/page3';
import {Map} from '../pages/page4/page4';
import {Settings} from '../pages/page5/page5';

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    Person,
    You,
    Map,
    Settings
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    Person,
    You,
    Map,
    Settings
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
