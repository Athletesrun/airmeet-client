import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Person } from '../people/people';
import { HttpService } from '../../services/http.service';

@Component({
    selector: 'saved-profiles',
    templateUrl: 'savedProfiles.html',
    providers: [HttpService]
})

export class SavedProfiles {

    profiles; noProfiles;

    constructor(public navCtrl: NavController, public navParams: NavParams, public api: HttpService) {
      this.noProfiles = false;
    }

    ionViewWillEnter() {
      this.api.getSavedProfiles().subscribe((res) => {
        this.profiles = res;
        if (res.length === 0) {
          this.noProfiles = true;
        }
        else this.noProfiles = false
      }, (error) => {
          console.log(error);
      });
    }

    showProfile(profile) {
      this.navCtrl.push(Person, {
        item: profile
      })
    }

}
