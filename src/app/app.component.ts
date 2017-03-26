import { Component, ViewChild } from '@angular/core';
import { Nav, NavController, Platform } from 'ionic-angular';
import {StatusBar, Splashscreen, Keyboard} from 'ionic-native';

import { Welcome } from '../pages/welcome/welcome';

import { People } from '../pages/people/people';
import { Messages } from '../pages/messages/messages';
import { UserProfile } from '../pages/userProfile/userProfile';
import { Map } from '../pages/map/map';
import { Settings } from '../pages/settings/settings';
import { Saved } from '../pages/saved/saved';

import * as io from 'socket.io-client';

@Component({templateUrl: 'app.html'})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  socket: SocketIOClient.Socket;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  mapInterval;

  constructor(public platform: Platform) {

    if(localStorage.getItem("signedIn") === "true") {

      this.rootPage = People;

    } else {

      this.rootPage = Welcome;
      //@todo bring them to the right page within welcome or something idk
    }


    localStorage.setItem("inEvent", "true");
    localStorage.setItem("shareLocation", "true");

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

    } else {

      localStorage.setItem('apiURL', "https://api.airmeet.org");

    }


    this.socket = io.connect(localStorage.getItem('apiURL'), {
      query: 'token=' + localStorage.getItem('token')
    });


    if(localStorage.getItem("inEvent") === "true" && localStorage.getItem("shareLocation") === "true") {

      this.socket.on('connect', () => {

        console.log('connected YAY!!');

      });

      this.mapInterval = setInterval(() => {
        this.socket.emit('shareLocation');
      }, 500);

    }

  }

  openPage(page) {

    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario D3e9aC9q

    this.nav.setRoot(page.component);

  }

}
