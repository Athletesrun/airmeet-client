import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';

import { HttpService } from '../servics/http.service';

import { Welcome } from '../pages/welcome/welcome';

import { People, Person } from '../pages/people/people';
import { Messages, Conversation, NewConversation, NewConversationMessage } from '../pages/messages/messages';
import { UserProfile } from '../pages/userProfile/userProfile';
import { Map } from '../pages/map/map';
import { Settings, Settings_Name, Settings_Phone, Settings_Description, Settings_Facebook, Settings_LinkedIn, Settings_Twitter, Settings_Picture} from '../pages/settings/settings';

@NgModule({
  declarations: [
    MyApp,
    Welcome,
    People,
    Messages,
    Person,
    UserProfile,
    Map,
    Settings,
    Conversation,
    NewConversation,
    NewConversationMessage,
    Settings_Name,
    Settings_Phone,
    Settings_Description,
    Settings_Facebook,
    Settings_LinkedIn,
    Settings_Twitter,
    Settings_Picture

  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Welcome,
    People,
    Messages,
    Person,
    UserProfile,
    Map,
    Settings,
    Conversation,
    NewConversation,
    NewConversationMessage,
    Settings_Name,
    Settings_Phone,
    Settings_Description,
    Settings_Facebook,
    Settings_LinkedIn,
    Settings_Twitter,
    Settings_Picture
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
