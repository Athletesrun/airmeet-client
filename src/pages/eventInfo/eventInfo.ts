import { Component } from '@angular/core';

import { NavController, NavParams} from 'ionic-angular';

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

    private eventName;
    private eventDescription;
    private eventSchedule;
    private eventWebsite;
    private eventDate;
    private eventOrganizer;

    constructor(public navCtrl: NavController, public navParams: NavParams, public api: HttpService, public storage: Storage) {

    }

    ngOnInit() {

        this.api.getEventInfo().subscribe((event) => {

            console.log(event);

            this.eventName = event.name;
            this.eventDescription = event.description;
            this.eventSchedule = event.schedule;
            this.eventWebsite = event.website;
            this.eventDate = event.date;
            this.eventOrganizer = event.organizer;

        }, (err) => {
            console.log(err);
        });

    }

}
