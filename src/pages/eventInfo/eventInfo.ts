import { Component } from '@angular/core';

import { NavController, NavParams, Platform } from 'ionic-angular';

import { HttpService } from '../../services/http.service';

import { Storage } from '@ionic/storage'

@Component({
    selector: 'event-info',
    templateUrl: 'eventInfo.html',
    providers: [
        HttpService
    ]
})

export class EventInfo {

    constructor(public navCtrl: NavController, public navParams: NavParams, public api: HttpService, public storage: Storage) {
    }

}
