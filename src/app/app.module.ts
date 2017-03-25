import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

import { MyApp } from './app.component';

// import { HttpService } from '../servics/http.service';

import { Welcome, CreateAccount, signin, JoinEvent } from '../pages/welcome/welcome';

import { People, Person } from '../pages/people/people';
import { Messages, Conversation, NewConversation, NewConversationMessage } from '../pages/messages/messages';
import { UserProfile } from '../pages/userProfile/userProfile';
import { Map } from '../pages/map/map';
import { Settings, EventInfo, Settings_Name, Settings_Phone, Settings_Description, Settings_Interests, Settings_Facebook, Settings_LinkedIn, Settings_Twitter, Settings_Picture } from '../pages/settings/settings';
import { Saved } from '../pages/saved/saved';
import { SavedProfiles } from '../pages/saved/savedProfiles';
import { SavedMessages } from '../pages/saved/savedMessages';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '0d8749d3'
  }
};

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
    Saved,
    SavedMessages,
    SavedProfiles,
    Conversation,
    NewConversation,
    NewConversationMessage,
    EventInfo,
    Settings_Name,
    Settings_Phone,
    Settings_Description,
    Settings_Interests,
    Settings_Facebook,
    Settings_LinkedIn,
    Settings_Twitter,
    Settings_Picture,
    CreateAccount,
    signin,
    JoinEvent

  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'bottom'
    }),
    HttpModule,
    CloudModule.forRoot(cloudSettings)
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
    EventInfo,
    Saved,
    SavedMessages,
    SavedProfiles,
    Settings_Name,
    Settings_Phone,
    Settings_Description,
    Settings_Interests,
    Settings_Facebook,
    Settings_LinkedIn,
    Settings_Twitter,
    Settings_Picture,
    CreateAccount,
    signin,
    JoinEvent
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
