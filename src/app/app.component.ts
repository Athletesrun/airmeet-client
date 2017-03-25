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


@Component({templateUrl: 'app.html'})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {

    if(localStorage.getItem("signedIn") === "true") {

      this.rootPage = People;

    } else {
      this.rootPage = Welcome;
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

    localStorage.setItem('token', "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTQ4ODk4NTExOX0.9j8UrHWclPcqR_6cHsUz76cqpkkLwOtdt79aFZXnzE7ZpwMbNZWvdzZo1VByZvSYQhMbKVh16ClOTdCS9K3oY2HrGj52JK7mYCnY5xZGvA5EzqIjM4KHJ6cgLCAI-O1b5opb_gQhFVFKZmG3XCG9u1_amzAOFQCRwoqdXtuOAkeDRFQnboG4uM2Td54k98Puecydk1padLRO92HheqWHuHRYefp_UwzxxNmi2CJ-2KXvMxSj6MlCYkqwv8DYxIz99aVJaWxUJ7mxEGM5KKXJBBUpS5DqKWY8j8R0uAPF8OEl2Sq0CSKLHAuFxJ9qv7RUSIDpMFko8Pk1ldyQHE7srQ");
    localStorage.setItem('userId', "1");
    localStorage.setItem('event', '1');

    if(localStorage.getItem('useLocalServer') === 'true') {

      localStorage.setItem('apiURL', "http://localhost:8080/api/");

    } else {

      localStorage.setItem('apiURL', "https://api.airmeet.org/api/");

    }

  }

  openPage(page) {

    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario

    this.nav.setRoot(page.component);

  }

}
