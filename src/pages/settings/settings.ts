import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({templateUrl: 'Settings_Name.html'})
export class Settings_Name {
  data;
  constructor(public navParams: NavParams) {
    this.data = navParams.data;
  }
}
@Component({templateUrl: 'Settings_Phone.html'})
export class Settings_Phone {
  constructor(public navParams: NavParams) {
  }
}
@Component({templateUrl: 'Settings_Description.html'})
export class Settings_Description {
  constructor(public navParams: NavParams) {
  }
}
@Component({templateUrl: 'Settings_Facebook.html'})
export class Settings_Facebook {
  constructor(public navParams: NavParams) {
  }
}
@Component({templateUrl: 'Settings_LinkedIn.html'})
export class Settings_LinkedIn {
  constructor(public navParams: NavParams) {
  }
}
@Component({templateUrl: 'Settings_Twitter.html'})
export class Settings_Twitter {
  constructor(public navParams: NavParams) {
  }
}
@Component({templateUrl: 'Settings_Picture.html'})
export class Settings_Picture {
  constructor(public navParams: NavParams) {
  }
}



@Component({selector: 'page-page5', templateUrl: 'settings.html'})
export class Settings {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  public name;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.name = "Bennb";

    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];
    for (let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }

  tapEvent(event, item) {
    // That's right, we're pushing to ourselves!
    if(event === "name") {
      this.navCtrl.push(Settings_Name, {
        name: this.name
      });
      console.log(name);
    }
    if(event === "Phone") {
      this.navCtrl.push(Settings_Phone, {})
    }
    if(event === "Description") {
      this.navCtrl.push(Settings_Description, {})
    }
    if(event === "Facebook") {
      this.navCtrl.push(Settings_Facebook, {})
    }
    if(event === "LinkedIn") {
      this.navCtrl.push(Settings_LinkedIn, {})
    }
    if(event === "Twitter") {
      this.navCtrl.push(Settings_Twitter, {})
    }
    if(event === "Picture") {
      this.navCtrl.push(Settings_Picture, {})
    }
    if(event === "Change Facebook URL"){}
}}
