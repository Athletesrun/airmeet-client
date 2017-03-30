import { Component, ViewChild } from '@angular/core';
import { Nav, NavController, Platform, MenuController } from 'ionic-angular';
import {StatusBar, Splashscreen, Keyboard} from 'ionic-native';

import { Welcome, JoinEvent, LoginSuccess } from '../pages/welcome/welcome';

import { People } from '../pages/people/people';
import { Messages } from '../pages/messages/messages';
import { UserProfile } from '../pages/userProfile/userProfile';
import { Map } from '../pages/map/map';
import { Settings } from '../pages/settings/settings';
import { Saved } from '../pages/saved/saved';

import { SocketService } from '../services/socket.service';

@Component({templateUrl: 'app.html', providers: [SocketService]})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;
  constructor(public platform: Platform, public sockets: SocketService, public menu: MenuController) {

    if(localStorage.getItem("signedIn") === "true" && localStorage.getItem('inEvent') === "true") {

      this.rootPage = People;

    } else if(localStorage.getItem("signedIn") === "true") {

      this.rootPage = JoinEvent;

    } else {

      this.rootPage = Welcome;
      //@todo bring them to the right page within welcome or something idk

    }

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'People', component: People },
      { title: 'Messages', component: Messages },
      { title: 'Your Profile', component: UserProfile },
      { title: 'Map', component: Map },
      { title: 'Saved Content', component: Saved },
      { title: 'Settings', component: Settings }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

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

    if(localStorage.getItem('useLocalServer') === 'true') {

      localStorage.setItem('apiURL', "http://localhost:8080");
      localStorage.setItem('socketURL', "http://localhost:9090");

    } else {

      localStorage.setItem('apiURL', "https://api.airmeet.org");
      localStorage.setItem('socketURL', "https://sockets.airmeet.org");

    }

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
