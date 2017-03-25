import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { SavedProfiles } from './savedProfiles';
import { SavedMessages } from './savedMessages';

@Component({
    selector: 'saved-page',
    templateUrl: 'saved.html',
    providers: [
        SavedProfiles,
        SavedMessages
    ]

})

export class Saved {

    SavedProfiles = SavedProfiles;
    SavedMessages = SavedMessages;

    constructor(public navCtrl: NavController, public navParams: NavParams) {

    }

    ngOnInit() {

    }

}