import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { People } from '../pages/people/people';
import { Messages } from '../pages/messages/messages';
import { UserProfile } from '../pages/userProfile/userProfile';
import { Map } from '../pages/map/map';
import { Settings } from '../pages/settings/settings';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = People;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'People', component: People },
      { title: 'Messages', component: Messages },
      { title: 'Your Profile', component: UserProfile },
      { title: 'Map', component: Map },
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

    let apiURL = "http://localhost:8080/api/";

    let token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE4MCwiaWF0IjoxNDg4ODExMDY4fQ.wDj4Qv4WVGnACJZTwBM6YsAERTb0Ic8WruApYX5gWye1v3CBwoVzgVVWAW-qVXqFgAmWqputPpY9kh8vAfWmefECkWIRUEDImLuZmhPv44ruPhHOm7RYfSo76M98mCCGhDM28-WiV2u1sBYayETYbNTxZWhIZjngIKVh7vzNovmLJdLn7D4nsIu13tLzELrBacnWP8NdwqEZPn09RXl-J_7SeKs4ACfxSIhkMVslJxlINEto5m9ri65ib5eFzK7nP6mVFnA0PvLJfLvBzVF-obqpxQYhdUg-HD4bjwwZt3Z9hkvUBYcsuwHqEdCS89KadyDx1TS8oK0gdeWjdu7gnA";


    localStorage.setItem('token', token);
    localStorage.setItem('userId', JSON.stringify({
      userId: 180
    }));
    localStorage.setItem('apiURl', apiURL);

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
