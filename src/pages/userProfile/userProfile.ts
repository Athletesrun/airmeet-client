import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import {HttpService} from '../../services/http.service';

@Component({
  selector: 'page-page3',
  templateUrl: 'userProfile.html',
  providers: [HttpService]
})
export class UserProfile {
  item; fullpic;

  constructor(public navCtrl: NavController, public navParams: NavParams, private api: HttpService) {
    this.item = {};
    this.fullpic = null;
  }

  ngOnInit() {
    this.getPeople();
  }

  getImage(){
    let a;
    if (this.item.picture !== null) {
      a = "url(https://s3.us-east-2.amazonaws.com/airmeet-uploads/pictures/" + this.item.picture + ")";
    }
    else {
      a = "url(assets/profile.gif)"
    }
    return a
  }

  getPeople() {
    this.api.getOwnProfile().subscribe(
      (profile) => {
        console.log(profile);
        this.item = profile;
      },
      (err) => {
        console.log(err)
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
