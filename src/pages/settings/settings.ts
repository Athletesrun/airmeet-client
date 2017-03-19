import { Component, Input } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { HttpService } from '../../services/http.service';

@Component({templateUrl: 'eventInfo.html', providers: [HttpService]})
export class EventInfo {

    private eventName;
    private eventOrganizer;
    private eventWebsite;
    private eventDate;
    private eventDescription;

    private updateInterval;

    constructor(private api: HttpService) {
    }

    ngOnInit() {

        this.getEventInfo();

        this.updateInterval = setInterval(() => {
            this.getEventInfo();
        }, 8000);

    }

    onNgDestroy() {

        clearInterval(this.updateInterval);

    }

    getEventInfo() {

        this.api.getEventInfo().subscribe((event) => {

            this.eventName = event.name;
            this.eventOrganizer = event.organizer;
            this.eventWebsite = event.website;
            this.eventDescription = event.description;

            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            event.date = new Date(event.date);

            this.eventDate = months[event.date.getMonth()] + " " + event.date.getDate() + ", " + event.date.getFullYear();

        }, (err) => {

            console.log(err);

            alert(err);

        });

    }

}

@Component({templateUrl: 'Settings_Name.html', providers: [HttpService]})
export class Settings_Name {

    private profile;

    private firstName:string = "";
    private lastName:string = "";

    constructor(private api: HttpService, private navCtrl: NavController) {
    }

    setName() {

        if(this.firstName.trim() !== "" || this.lastName.trim() !== "") {

            this.api.updateProfile({firstName: this.firstName, lastName: this.lastName}).subscribe(() => {

                this.navCtrl.popToRoot();

            }, (err) => {
                console.log(err);
            });
        }

    }

}

@Component({templateUrl: 'Settings_Phone.html', providers: [HttpService]})
export class Settings_Phone {

     constructor(private api: HttpService, private navCtrl: NavController) {}

     private phoneNumber;

     setPhoneNumber() {

         if(!isNaN(parseInt(this.phoneNumber))) {

             this.api.updateProfile({phone: parseInt(this.phoneNumber)}).subscribe(() => {

                 console.log('got here');

                 this.navCtrl.popToRoot();

             }, (err) => {
                 console.log(err);
             });

         }

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



@Component({selector: 'settings', templateUrl: 'settings.html', providers: [ HttpService ]})
export class Settings {

    private profile = {
        firstName: "",
        lastName: "",
        phone: new Number()
    };

    private updateProfileInterval

    constructor(public navCtrl: NavController, public navParams: NavParams, private api: HttpService) {

    }

    ngOnInit() {

        this.updateProfileInterval = setInterval(() => {

            this.getProfile();

        }, 500);

    }

    ngOnDestroy() {

        clearInterval(this.updateProfileInterval);

    }

    getProfile() {

        this.api.getOwnProfile().subscribe((profile) => {

            this.profile = profile;

        }, (err) => {
            alert(err);
        });

    }

    tapEvent(event, item) {
        // That's right, we're pushing to ourselves!
        if(event === "name") {

            this.navCtrl.push(Settings_Name);

        } else if(event === "eventInfo") {

            this.navCtrl.push(EventInfo);

        } else if(event === "Phone") {

            this.navCtrl.push(Settings_Phone);

        } else if(event === "Description") {

            this.navCtrl.push(Settings_Description, {});

        } else if(event === "Facebook") {

            this.navCtrl.push(Settings_Facebook, {});

        } else if(event === "LinkedIn") {

            this.navCtrl.push(Settings_LinkedIn, {});

        } else if(event === "Twitter") {

            this.navCtrl.push(Settings_Twitter, {})

        } else if(event === "Picture") {

            this.navCtrl.push(Settings_Picture, {})

        } else if(event === "Change Facebook URL"){

        }
    }
}
