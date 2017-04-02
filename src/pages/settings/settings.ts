import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { HttpService } from '../../services/http.service';

import { Welcome, JoinEvent } from '../welcome/welcome';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import {DomSanitizer} from "@angular/platform-browser";
import {Transfer, FileUploadOptions, TransferObject} from "@ionic-native/transfer";
import { Camera, CameraOptions } from "@ionic-native/camera";

@Component({templateUrl: 'Settings_Name.html', providers: [HttpService]})
export class Settings_Name {

    private firstName:string = "";
    private lastName:string = "";

    private profileFirstName;
    private profileLastName;

    constructor(public navParams: NavParams, private api: HttpService, private navCtrl: NavController) {

        this.profileFirstName = navParams.data.firstName;
        this.profileLastName = navParams.data.lastName;

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

     constructor(public navParams: NavParams, private api: HttpService, private navCtrl: NavController) {

     }

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

    constructor(public navParams: NavParams, private api: HttpService, private navCtrl: NavController) {

        //this.description = navParams.data.description;

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

    private newInterest:string;
    private interests = [];

    constructor(public navParams: NavParams, private api: HttpService, private navCtrl: NavController) {

        if(navParams.data.interests !== null) {

            this.interests = navParams.data.interests.interests;

        }
    }

    addInterest() {

        this.newInterest = this.newInterest.trim();

        if(this.newInterest !== "") {

            this.interests.push(this.newInterest);

            this.newInterest = "";

            this.api.updateProfile({interests: { interests: this.interests}}).subscribe(() => {

            }, (err) => {
                console.log(err);
            })

        }

    }

    removeInterest(i) {

        console.log('here');

        this.interests.splice(i, 1);

        this.api.updateProfile({interests: { interests: this.interests}}).subscribe(() => {

        }, (err) => {
            console.log(err);
        })

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

    constructor(public navParams: NavParams, private api: HttpService, private navCtrl: NavController) {

        //this.handle = navParams.data.twitter.handle;

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
@Component({templateUrl: 'Settings_Picture.html', providers: [Camera, Transfer, File]})
    export class Settings_Picture {
      image; showImg; sObj;
     constructor(public navParams: NavParams, public camera: Camera, private transfer: Transfer, private file: File, private ds: DomSanitizer) {
    }
  take(location) {
    const options1: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.NATIVE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      cameraDirection: this.camera.Direction.FRONT,
      correctOrientation: true,
      sourceType: location === "camera" ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 500,
      targetHeight: 500
    };
    this.camera.getPicture(options1).then((imageData) => {
      this.showImg = true;
      this.image = imageData;
      console.log(this.ds.bypassSecurityTrustUrl(imageData));
    }, (err) => {
      console.log(err);
    });
  }
  upload() {
    const fileTransfer: TransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: 'picture',
      fileName: 'image.jpg'
    };
    fileTransfer.upload(this.image, localStorage.getItem("apiURL") + "/api/updateProfilePicture/" + localStorage.getItem('token'), options)
      .then((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      })
  }
}

@Component({templateUrl: 'privacyPolicy.html'})
export class PrivacyPolicy {
    constructor(public navParams: NavParams) {
    }
}

@Component({selector: 'settings', templateUrl: 'settings.html', providers: [ HttpService ]})
export class Settings {

    private profile = {
        interests: {},
        firstName: "",
        lastName: "",
        phone: "",
        description: "",
        twitter: ""
    };

    inEvent;

    private updateProfileInterval;

    constructor(public navCtrl: NavController, public navParams: NavParams, private api: HttpService, public storage: Storage) {
      this.inEvent = localStorage.getItem('inEvent');
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

            this.navCtrl.push(Settings_Name, {
                firstName: this.profile.firstName,
                lastName: this.profile.lastName
            });

        } else if(event === "Phone") {

            this.navCtrl.push(Settings_Phone, {
                phone: this.profile.phone
            });

        } else if(event === "Description") {

            this.navCtrl.push(Settings_Description, {
                description: this.profile.description
            });

        } else if(event === "Interests") {

            this.navCtrl.push(Settings_Interests, {
                interests: this.profile.interests
            });

        } else if(event === "Facebook") {

            this.navCtrl.push(Settings_Facebook, {});

        } else if(event === "LinkedIn") {

            this.navCtrl.push(Settings_LinkedIn, {});

        } else if(event === "Twitter") {

            this.navCtrl.push(Settings_Twitter, {
                twitter: this.profile.twitter
            })

        } else if(event === "Picture") {

            this.navCtrl.push(Settings_Picture, {});

        } else if(event === "signOut") {

            this.storage.remove('userId');
            localStorage.removeItem('userId');
            this.storage.remove('token');
            localStorage.removeItem('token');
            this.storage.remove('signedIn');
            localStorage.removeItem('signedIn');
            this.storage.remove('inEvent');
            localStorage.removeItem('inEvent');
            this.storage.remove('event');
            localStorage.removeItem('event');

            this.navCtrl.setRoot(Welcome);
            this.navCtrl.push(Welcome);

        } else if(event === "leaveEvent") {

            this.api.leaveEvent().subscribe(() => {

                this.storage.remove("inEvent");
                localStorage.removeItem("inEvent");
                this.storage.remove("event");
                localStorage.removeItem("event");

                this.navCtrl.setRoot(JoinEvent);
                this.navCtrl.push(JoinEvent);
            });

        } else if(event === "privacyPolicy") {

            this.navCtrl.push(PrivacyPolicy, {})

        }
    }
}
