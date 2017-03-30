import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { HttpService } from '../../services/http.service';

@Component({
    selector: 'saved-profiles',
    templateUrl: 'savedProfiles.html',
    providers: [HttpService]
})

export class SavedProfiles {

    profiles;

    constructor(public navCtrl: NavController, public navParams: NavParams, public api: HttpService) {

    }

    ngOnInit() {
      this.api.getSavedProfiles().subscribe((res) => {
        console.log(res);
      })
    }

}
