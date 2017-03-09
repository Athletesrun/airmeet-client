import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import {HttpService} from '../../services/http.service';

@Component({
  selector: 'page-page3',
  templateUrl: 'userProfile.html',
  providers: [HttpService]
})
export class UserProfile {
  item;

  constructor(public navCtrl: NavController, public navParams: NavParams, private api: HttpService) {
    this.item = {};
  }

  ngOnInit() {
    this.getPeople();
  }

  getPeople() {
    this.api.getOwnProfile().subscribe(
      (profile) => {
        this.item = profile;
      },
      (err) => {
        console.log(err)
      },
      () => {
        console.log("something");
      }
    )
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(UserProfile, {
      item: item
    });
  }
}
