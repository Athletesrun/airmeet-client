import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { People, Person } from '../pages/people/people';
import { Messages, Conversation } from '../pages/messages/messages';
import { UserProfile } from '../pages/userProfile/userProfile';
import { Map } from '../pages/map/map';
import { Settings } from '../pages/settings/settings';

@NgModule({
  declarations: [
    MyApp,
    People,
    Messages,
    Person,
    UserProfile,
    Map,
    Settings,
    Conversation
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    People,
    Messages,
    Person,
    UserProfile,
    Map,
    Settings,
    Conversation
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
