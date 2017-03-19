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

        });

    }

}

@Component({templateUrl: 'Settings_Name.html', providers: [HttpService]})
export class Settings_Name {

    private firstName:string = "";
    private lastName:string = "";

    constructor(private api: HttpService, private navCtrl: NavController) {
    }

    setName() {

        this.firstName = this.firstName.trim();
        this.lastName = this.lastName.trim();

        if(this.firstName !== "" && this.firstName.length <= 25 && this.lastName !== "" && this.lastName.length <= 25) {

            this.api.updateProfile({firstName: this.firstName, lastName: this.lastName}).subscribe(() => {

                this.navCtrl.popToRoot();

            }, (err) => {
                console.log(err);
            });
        } else if(this.firstName.length > 20 || this.lastName.length > 20){
            alert("Oops. Your name must less less than 25 characters")
        }

    }

}

@Component({templateUrl: 'Settings_Phone.html', providers: [HttpService]})
export class Settings_Phone {

     constructor(private api: HttpService, private navCtrl: NavController) {}

     private phoneNumber;

     setPhoneNumber() {

         this.phoneNumber = this.phoneNumber.trim();

         if(this.phoneNumber.length <= 20) {

             this.api.updateProfile({phone: this.phoneNumber}).subscribe(() => {

                 console.log('got here');

                 this.navCtrl.popToRoot();

             }, (err) => {
                 console.log(err);
             });

         } else {

             alert("Oops! Please enter a valid phone number.");

         }

     }
}

@Component({templateUrl: 'Settings_Description.html', providers: [HttpService]})
export class Settings_Description {

    private description = "";

    constructor(private api: HttpService, private navCtrl: NavController) {
    }

    setDescription() {

        this.description = this.description.trim();

        if(this.description !== "" && this.description.length <= 180) {

            this.api.updateProfile({description: this.description}).subscribe(() => {

                this.navCtrl.popToRoot();

            }, (err) => {
                console.log(err);
            });

        } else {

            alert("Oops! Please enter a valid description that is less than 180 characters.");

        }

    }
}

@Component({templateUrl: 'Settings_Interests.html', providers: [HttpService]})
export class Settings_Interests {

    constructor(private api: HttpService, private navCtrl: NavController) {
    }

}

@Component({templateUrl: 'Settings_Facebook.html', providers: [HttpService]})
export class Settings_Facebook {

    private link = "";

    constructor(private api: HttpService, private navCtrl: NavController) {
    }

    setFacebook() {

        this.link = this.link.trim();

        if(this.link !== "" && this.link.length <= 200) {

            this.api.updateProfile({facebook: this.link}).subscribe(() => {

                this.navCtrl.popToRoot();

            }, (err) => {
                console.log(err);
            });

        } else {

            alert("Oops! Please enter a valid link.");

        }

    }
}
@Component({templateUrl: 'Settings_LinkedIn.html', providers: [HttpService]})
export class Settings_LinkedIn {

    private link = "";

    constructor(private api: HttpService, private navCtrl: NavController) {}

    setLinkedIn() {

        this.link = this.link.trim();

        if(this.link !== "" && this.link.length <= 200) {

            this.api.updateProfile({linkedin: this.link}).subscribe(() => {

                this.navCtrl.popToRoot();

            }, (err) => {
                console.log(err);
            });

        } else {

            alert("Oops! Please enter a valid link.");

        }

    }
}
@Component({templateUrl: 'Settings_Twitter.html', providers: [HttpService]})
export class Settings_Twitter {

    private handle = "";

    constructor(private api: HttpService, private navCtrl: NavController) {
    }

    setTwitter() {

        this.handle = this.handle.trim();

        if(this.handle.charAt(0) === "@") {

            this.handle = this.handle.slice(1);

        }

        if(this.handle !== "" && this.handle.length <= 16) {

            this.api.updateProfile({twitter: this.handle}).subscribe(() => {

                this.navCtrl.popToRoot();

            }, (err) => {
                console.log(err);
            });

        } else {

            alert("Oops! Please enter a valid handle that is 16 characters or less");

        }

    }
}
@Component({templateUrl: 'Settings_Picture.html'})
    export class Settings_Picture {
     constructor(public navParams: NavParams) {
    }
}



@Component({selector: 'settings', templateUrl: 'settings.html', providers: [ HttpService ]})
export class Settings {

    private profile = {};

    private updateProfileInterval;

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

            console.log(err);

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

        } else if(event === "Interests") {

            this.navCtrl.push(Settings_Interests, {});

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
