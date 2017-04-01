import { Component, ViewChild } from '@angular/core';
import { Nav, NavController, Platform, MenuController } from 'ionic-angular';
import {StatusBar, Splashscreen, Keyboard} from 'ionic-native';

import { Storage } from '@ionic/storage';

import { Welcome, JoinEvent, LoginSuccess } from '../pages/welcome/welcome';

import { People } from '../pages/people/people';
import { Organizations } from '../pages/organizations/organizations';
import { EventInfo } from '../pages/eventInfo/eventInfo';
import { Messages } from '../pages/messages/messages';
import { UserProfile } from '../pages/userProfile/userProfile';
import { Map } from '../pages/map/map';
import { Settings } from '../pages/settings/settings';
import { Saved } from '../pages/saved/saved';

import { SocketService } from '../services/socket.service';
import { HttpService } from '../services/http.service';

@Component({templateUrl: 'app.html', providers: [SocketService, HttpService]})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;
  constructor(public platform: Platform, public sockets: SocketService, public menu: MenuController, public api: HttpService, private storage: Storage) {

    storage.ready().then(() => {

      storage.get('signedIn').then((signedIn) => {
        storage.get('inEvent').then((inEvent) => {
          if (signedIn === "true" && inEvent === "true") {

            this.rootPage = People;

          } else if (signedIn === "true") {

            this.rootPage = JoinEvent;

          } else {

            this.rootPage = Welcome;
            //@todo bring them to the right page within welcome or something idk

          }

          this.initializeApp();

          // used for an example of ngFor and navigation
          this.pages = [
            {title: 'People', component: People},
            {title: 'Messages', component: Messages},
            {title: 'Your Profile', component: UserProfile},
            {title: 'Map', component: Map},
            {title: 'Organizations', component: Organizations},
            {title: 'Event Info', component: EventInfo },
            {title: 'Saved Content', component: Saved},
            {title: 'Settings', component: Settings}
          ];
        });

      });

    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
    /*
    if (this.platform.is('ios')) {
      let
        appEl = <HTMLElement>(document.getElementsByTagName('ION-APP')[0]),
        appElHeight = appEl.clientHeight;

      Keyboard.disableScroll(true);

      window.addEventListener('native.keyboardshow', (e) => {
        appEl.style.height = (appElHeight - (<any>e).keyboardHeight) + 'px';
      });

      window.addEventListener('native.keyboardhide', () => {
        appEl.style.height = '100%';
      });
    }
    */

    this.storage.get('useLocalServer').then((useLocalServer) => {
      this.storage.get('apiURL').then((apiURL) => {

        if(useLocalServer === 'true') {

          this.storage.set('apiURL', "http://localhost:8080");
          this.storage.set('socketURL', "http://localhost:9090");

        } else {

          this.storage.set('apiURL', "https://api.airmeet.org");
          this.storage.set('socketURL', "https://sockets.airmeet.org");

        }
      });

    });

    this.sockets.beginSharingLocation();

  }

  ngAfterViewInit() {
    this.menu.swipeEnable(false, 'sideNavMenu');
  }

  openPage(page) {

    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario D3e9aC9q

    this.nav.setRoot(page.component);

  }

}
