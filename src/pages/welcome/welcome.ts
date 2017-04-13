import { Component, ViewChild } from '@angular/core';
import {NavController, NavParams, Slides, MenuController, LoadingController} from 'ionic-angular';

import * as SHA2 from "../../services/sha.service";
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';

import { Saved } from '../saved/saved';

import { Storage } from '@ionic/storage';
import { HttpService } from '../../services/http.service';
import { People } from "../people/people";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { Settings } from '../settings/settings'
import {DomSanitizer} from "@angular/platform-browser";

@Component({selector: "welcome-page", templateUrl: "welcome.html", providers: [HttpService]})

export class Welcome {

    plane; welcome;

    constructor(private api: HttpService, public navCtrl: NavController) {
      this.plane = "step1";
    }

    ngOnInit() {
      setTimeout(() => this.plane = "step2", 1000);
      setTimeout(() => this.welcome = "step2", 1250);
    }

    Create(event, item){
        if (event === "Acct"){
            this.navCtrl.push(CreateAccount);
        }
        else if (event === "Sign"){
            this.navCtrl.push(signin);
        }
    }

}

@Component({templateUrl: "Profile-Creation.html", providers: [HttpService, Camera, Transfer, File]})
export class ProfileCreation{
  @ViewChild(Slides) slides: Slides;
  status; description; interests; facebook; phone; twitter; image; showImg; loading; things;
  constructor(public navParams: NavParams, public navCtrl: NavController, public api: HttpService, public camera: Camera, private transfer: Transfer, private file: File, private ds: DomSanitizer, public loadingCtrl: LoadingController){
    this.status = {
      description: "normal",
      interests: "normal",
      facebook: "normal",
      phone: "normal",
      twitter: "normal",
      linkedin: "normal"
    };
    this.things = {
      display: "block"
    }
  }
  join() {
    this.navCtrl.push(JoinEvent);
  }

  hide() {
    this.things = {
      display: "none"
    }
  }

  show() {
    this.things = {
      display: "block"
    }
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
      targetWidth: 200,
      targetHeight: 200
    };
    this.camera.getPicture(options1).then((imageData) => {
      this.upload(imageData);
    }, (err) => {
      console.log(err);
    });
  }
  test() {
    this.loading = this.loadingCtrl.create({
      content: "Uploading picture...",
      duration: 3000
    });
    this.loading.present();
  }
  upload(image) {
    this.loading = this.loadingCtrl.create({
      content: "Uploading picture..."
    });
    this.loading.present();
    const fileTransfer: TransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: 'picture',
      fileName: 'image.jpg'
    };
    fileTransfer.upload(image, localStorage.getItem("apiURL") + "/api/updateProfilePicture/" + localStorage.getItem('token'), options)
    .then((res) => {
      this.completeImage(res);
    }, (err) => {
      console.log(err);
    })
  }
  completeImage(status) {
    alert("completeImage" + JSON.parse(status.response).status);
    if(JSON.parse(status.response).status.status === "success") {
      this.loading.dismiss();
      setTimeout(() => this.slides.slideNext(), 500);
    }
    else {
      this.loading.dismiss();
      alert("uh oh!\n" + status.message);
    }
  }
  update(a) {
    let obj = {};
    obj[a] = this[a];
    return this.api.updateProfile(obj).subscribe((status) => {
        this.status[a] += " success";
        setTimeout(() => this.slides.slideNext(), 500);
      },
      (err) => {
        console.log(err)
    })
  }
}

@Component({templateUrl: 'Create-Account.html', providers: [HttpService]})
export class CreateAccount {

    firstName; lastName; email; password; states;

    constructor(public navParams: NavParams, public navCtrl: NavController, public api: HttpService, public storage: Storage){
      this.states = {
        firstName: "normal",
        lastName: "normal",
        email: "normal",
        password: "normal"
      }
    }
    create(){
        this.navCtrl.push(signin);
    }
    join() {
      this.states.email = "error";
      let good = true;
      if (!this.firstName) {
        good = false;
        this.states.firstName = "error";
        alert("Do not leave your first name blank.")
      }
      else this.states.firstName = "success";
      if (!this.lastName) {
        good = false;
        this.states.lastName = "error";
        alert("Do not leave your last name blank.")
      }
      else this.states.lastName = "success";
      if (!this.email) {
        good = false;
        this.states.email = "error";
        alert("Do not leave email blank.")
      } else if (!this.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        alert("Use a real email address.");
        good = false;
        this.states.email = "error";
      }
      else this.states.email = "success";
      if (!this.password) {
        good = false;
        this.states.password = "error";
        alert("Do not leave password blank.")
      }
      else if (this.password.length < 6) {
        good = false;
        this.states.password = "error";
        alert("Password should be at least 6 characters.")
      }
      else this.states.password = "success";
      if (good) {
        this.api.register(this.email, SHA2.SHA2_256(this.password), this.firstName, this.lastName).subscribe(
          (response) => {
            if (response.status == "success") {

                this.storage.set('token', response.token);
                localStorage.setItem('token', response.token);
                this.storage.set('signedIn', "true");
                localStorage.setItem('signedIn', "true");
                this.storage.set('userId', response.id);
                localStorage.setItem('userId', response.id);

              this.navCtrl.push(CreateProfile1);

            } else {

                alert(response.message);
                this.states.firstName = "normal";
                this.states.lastName = "normal";
                this.states.email = "normal";
                this.states.password = "normal";

            }
          },
          (err) => {
            console.log(err)
          }
        )
      }
    }
}
@Component({templateUrl: 'sign-in.html', providers: [HttpService]})

export class signin {

    email; password; states;

    constructor(public navParams: NavParams, public navCtrl: NavController, public api: HttpService, public storage: Storage, public menu: MenuController){
      this.states = {
        email: "normal",
        password: "normal"
      }
    }

    create() {
        this.navCtrl.push(CreateAccount);
    }
    code() {
        this.navCtrl.push(CreateAccount);
    }
    join() {
      let good = true;
      if (!this.email) {
        good = false;
        this.states.email = "error";
      }
      else this.states.email = "normal";
      if (!this.password) {
        good = false;
        this.states.password = "error";
      }
      else this.states.password = "normal";
      if (good) {
        this.api.login(this.email, SHA2.SHA2_256(this.password)).subscribe(
          (response) => {
            if (response.status === "success") {

              this.storage.set("userId", response.id);
              localStorage.setItem("userId", response.id);
              this.storage.set("token", response.token);
              localStorage.setItem("token", response.token);
              this.storage.set('signedIn', "true");
              localStorage.setItem('signedIn', "true");

              if(typeof response.event === 'number') {

                  this.storage.set('inEvent', "true");
                  localStorage.setItem("inEvent", "true");
                  this.storage.set('event', response.event);
                  localStorage.setItem('event', response.event.toString());

                  this.menu.swipeEnable(true, 'sideNavMenu');

                  this.navCtrl.setRoot(People);

              } else {

                  this.navCtrl.setRoot(JoinEvent);

              }

            }
            else {
              this.states.email = "error";
              this.states.password = "error";
            }
          }, (error) => {
              console.log(error);
            }
        )
      }
    }
}
@Component({templateUrl: 'Join-event.html', providers: [HttpService]})

export class JoinEvent {

  status; things;

    constructor(public navParams: NavParams, public navCtrl: NavController, public api: HttpService, public storage: Storage){
      this.status = "normal";
    }

    showSettings() {
      this.navCtrl.push(Settings);
    }

    showSavedContent() {

        this.navCtrl.push(Saved);
    }

    joinEvent(event) {
        let ip = event.target.value;
        if (ip) {
          if (ip.length === 8) {
            this.api.joinEvent(ip).subscribe(
              (res) => {
                if (res.status === "success") {
                  this.storage.set("event", res.eventId);
                  localStorage.setItem("event", res.eventId);
                  this.storage.set("inEvent", "true");
                  localStorage.setItem("inEvent", "true");

                  localStorage.setItem("shareLocation", "true");
                  this.storage.set("shareLocation", "true").then(() =>
                  {
                    this.api.getEventInfo().subscribe((res) => {
                      this.navCtrl.push(LoginSuccess, {
                        eventName: res.name
                      })
                    }, (err) => console.log(err));
                  });
                  //this.navCtrl.setRoot(People);
                }
                else {
                  this.status = "error";
                  console.log(res);
                }
              }, (error) => {
                  console.log(error);
                }
            )
          }
          else this.status = "normal";
        }
    }

}

@Component({templateUrl: 'success.html', providers: [HttpService]})

export class LoginSuccess {

  eventName; plane;

  constructor(public navParams: NavParams, public navCtrl: NavController, public api: HttpService, public menu: MenuController) {
    this.eventName = this.navParams.data.eventName;
    this.plane = "step1";
  }

  ngOnInit() {

    setTimeout(() => this.plane = "step2", 500);
    setTimeout(() => this.plane = "step3", 3000);
    setTimeout(() => {

        this.menu.swipeEnable(true, 'sideNavMenu');

        this.navCtrl.setRoot(People);
    }, 4000);
    //setTimeout(() => this.navCtrl.setRoot(People), 3000);
  }

}

@Component({
  template: `
    <ion-content class="blue white">
      <div class="nav-arrows">
        <ion-buttons>
          <button ion-button class="skip-btn" icon large clear (click)="join()">Skip&nbsp;<ion-icon name="arrow-forward"></ion-icon></button>
        </ion-buttons>
      </div>
      <h1 [ngStyle]='things' class="heading2">Nice! Now let's add some information to your profile</h1>
      <h2 [ngStyle]='things' class="white info"
          style="position: absolute; right: 0; left: 0; margin: auto; text-align: center;">Add a description</h2>
      <ion-input [ngClass]="status.description" (focus)="hide()" (blur)="show()" class="textbox" type="text" maxlength="180"
                 [(ngModel)]="description" placeholder="Description of you" value=""></ion-input>
      <div class="flex">
        <button ion-button class="button2" (click)="update('description', 180)" large color="secondary">Add</button>
      </div>
    </ion-content>`,
  providers: [HttpService, Camera, Transfer, File]
})
export class CreateProfile1 {
  status;
  description;
  interests;
  facebook;
  phone;
  twitter;
  image;
  showImg;
  loading;
  things;

  constructor(public navParams: NavParams, public navCtrl: NavController, public api: HttpService, public camera: Camera, private transfer: Transfer, private file: File, private ds: DomSanitizer, public loadingCtrl: LoadingController) {
    this.status = {
      description: "normal",
      interests: "normal",
      facebook: "normal",
      phone: "normal",
      twitter: "normal",
      linkedin: "normal"
    };
    this.things = {
      display: "block"
    }
  }

  join() {
    this.navCtrl.push(CreateProfile2);
  }

  hide() {
    this.things = {
      display: "none"
    }
  }

  show() {
    this.things = {
      display: "block"
    }
  }

  update(a) {
    let obj = {};
    obj[a] = this[a];
    return this.api.updateProfile(obj).subscribe((status) => {
        this.status[a] += " success";
        setTimeout(() => this.navCtrl.push(CreateProfile2), 500);
      },
      (err) => {
        console.log(err)
      })
  }
}

@Component({
  template: `
    <ion-content class="blue white">
      <div class="nav-arrows">
        <ion-buttons>
          <button ion-button icon large clear class="back-btn" (click)="back()"><ion-icon name="arrow-back"></ion-icon>&nbsp;Back</button>
          <button ion-button icon large clear class="skip-btn" (click)="join()">Skip&nbsp;<ion-icon name="arrow-forward"></ion-icon></button>
        </ion-buttons>
      </div>
      <ion-icon [ngStyle]='things' class="logo info" name="call"></ion-icon>
      <h1 [ngStyle]='things' class="white info">Add a phone number</h1>
      <ion-input class="textbox" [(ngModel)]="phone" (focus)="hide()" (blur)="show()" [ngClass]="status.phone"
                 type="number" placeholder="Phone number" value=""></ion-input>
      <div class="flex">
        <button ion-button class="button2" (click)="update('phone', 7)" large color="secondary">Add</button>
      </div>
    </ion-content>`,
  providers: [HttpService, Camera, Transfer, File]
})
export class CreateProfile2 {
  status;
  description;
  interests;
  facebook;
  phone;
  twitter;
  image;
  showImg;
  loading;
  things;

  constructor(public navParams: NavParams, public navCtrl: NavController, public api: HttpService, public camera: Camera, private transfer: Transfer, private file: File, private ds: DomSanitizer, public loadingCtrl: LoadingController) {
    this.status = {
      description: "normal",
      interests: "normal",
      facebook: "normal",
      phone: "normal",
      twitter: "normal",
      linkedin: "normal"
    };
    this.things = {
      display: "block"
    }
  }

  join() {
    this.navCtrl.push(CreateProfile3);
  }

  hide() {
    this.things = {
      display: "none"
    }
  }

  back() {
    this.navCtrl.pop();
  }

  show() {
    this.things = {
      display: "block"
    }
  }

  update(a) {
    let obj = {};
    obj[a] = this[a];
    return this.api.updateProfile(obj).subscribe((status) => {
        this.status[a] += " success";
        setTimeout(() => this.navCtrl.push(CreateProfile3), 500);
      },
      (err) => {
        console.log(err)
      })
  }
}

@Component({
  template: `
    <ion-content class="blue white">
      <div class="nav-arrows">
        <ion-buttons>
          <button ion-button icon large clear class="back-btn" (click)="back()"><ion-icon name="arrow-back"></ion-icon>&nbsp;Back</button>
          <button ion-button icon large clear class="skip-btn" (click)="join()">Skip&nbsp;<ion-icon name="arrow-forward"></ion-icon></button>
        </ion-buttons>
      </div>
      <ion-icon [ngStyle]='things' class="logo info" name="logo-facebook"></ion-icon>
      <h1 [ngStyle]='things' class="white info">Add a link to your Facebook profile</h1>
      <ion-input class="textbox" [(ngModel)]="facebook" (focus)="hide()" (blur)="show()" [ngClass]="status.facebook" type="text" placeholder="Facebook link" value=""></ion-input>
      <div class="flex">
        <button ion-button class="button2" large (click)="update('facebook', 50)" color="secondary">Add</button>
      </div>
    </ion-content>`,
  providers: [HttpService, Camera, Transfer, File]
})

export class CreateProfile3 {
  status;
  description;
  interests;
  facebook;
  phone;
  twitter;
  image;
  showImg;
  loading;
  things;

  constructor(public navParams: NavParams, public navCtrl: NavController, public api: HttpService, public camera: Camera, private transfer: Transfer, private file: File, private ds: DomSanitizer, public loadingCtrl: LoadingController) {
    this.status = {
      description: "normal",
      interests: "normal",
      facebook: "normal",
      phone: "normal",
      twitter: "normal",
      linkedin: "normal"
    };
    this.things = {
      display: "block"
    }
  }

  join() {
    this.navCtrl.push(CreateProfile4);
  }

  hide() {
    this.things = {
      display: "none"
    }
  }

  show() {
    this.things = {
      display: "block"
    }
  }

  back() {
    this.navCtrl.pop();
  }

  update(a) {
    let obj = {};
    obj[a] = this[a];
    return this.api.updateProfile(obj).subscribe((status) => {
        this.status[a] += " success";
        setTimeout(() => this.navCtrl.push(CreateProfile4), 500);
      },
      (err) => {
        console.log(err)
      })
  }
}

@Component({
  template: `
    <ion-content class="blue white">
      <div class="nav-arrows">
        <ion-buttons>
          <button ion-button icon large clear class="back-btn" (click)="back()"><ion-icon name="arrow-back"></ion-icon>&nbsp;Back</button>
          <button ion-button icon large clear class="skip-btn" (click)="join()">Skip&nbsp;<ion-icon name="arrow-forward"></ion-icon></button>
        </ion-buttons>
      </div>
      <ion-icon [ngStyle]='things' class="logo info"name="logo-twitter"></ion-icon>
      <h1 [ngStyle]='things' class="white info">Add your Twitter handle</h1>
      <ion-input class="textbox" [(ngModel)]="twitter" (focus)="hide()" (blur)="show()" [ngClass]="status.twitter" type="text" placeholder="Twitter" value=""></ion-input>
      <div class="flex">
        <button ion-button class="button2" (click)="update('twitter', 50)" large color="secondary">Add</button>
      </div>
    </ion-content>`,
  providers: [HttpService, Camera, Transfer, File]
})

export class CreateProfile4 {
  status;
  description;
  interests;
  facebook;
  phone;
  twitter;
  image;
  showImg;
  loading;
  things;

  constructor(public navParams: NavParams, public navCtrl: NavController, public api: HttpService, public camera: Camera, private transfer: Transfer, private file: File, private ds: DomSanitizer, public loadingCtrl: LoadingController) {
    this.status = {
      description: "normal",
      interests: "normal",
      facebook: "normal",
      phone: "normal",
      twitter: "normal",
      linkedin: "normal"
    };
    this.things = {
      display: "block"
    }
  }

  join() {
    this.navCtrl.push(CreateProfile5);
  }

  hide() {
    this.things = {
      display: "none"
    }
  }

  show() {
    this.things = {
      display: "block"
    }
  }

  back() {
    this.navCtrl.pop();
  }

  update(a) {
    let obj = {};
    obj[a] = this[a];
    return this.api.updateProfile(obj).subscribe((status) => {
        this.status[a] += " success";
        setTimeout(() => this.navCtrl.push(CreateProfile5), 500);
      },
      (err) => {
        console.log(err)
      })
  }
}

@Component({
  template: `
    <ion-content class="blue white">
      <div class="nav-arrows">
        <ion-buttons>
          <button ion-button icon large clear class="back-btn" (click)="back()"><ion-icon name="arrow-back"></ion-icon>&nbsp;Back</button>
          <button ion-button icon large clear class="skip-btn" (click)="join()">Skip&nbsp;<ion-icon name="arrow-forward"></ion-icon></button>
        </ion-buttons>
      </div>
      <ion-icon class="logo info" name="logo-linkedin" [ngStyle]='things'></ion-icon>
      <h1 [ngStyle]='things' class="white info">Add a link to your LinkedIn profile</h1>
      <ion-input class="textbox" [(ngModel)]="linkedin" (focus)="hide()" (blur)="show()" [ngClass]="status.linkedin" type="text" placeholder="LinkedIn link" value=""></ion-input>
      <div class="flex">
        <button ion-button class="button2" (click)="update('linkedin', 50)" large color="secondary">Add</button>
      </div>
    </ion-content>`,
  providers: [HttpService, Camera, Transfer, File]
})

export class CreateProfile5 {
  status;
  description;
  interests;
  facebook;
  phone;
  twitter;
  linkedin;
  image;
  showImg;
  loading;
  things;

  constructor(public navParams: NavParams, public navCtrl: NavController, public api: HttpService, public camera: Camera, private transfer: Transfer, private file: File, private ds: DomSanitizer, public loadingCtrl: LoadingController) {
    this.status = {
      description: "normal",
      interests: "normal",
      facebook: "normal",
      phone: "normal",
      twitter: "normal",
      linkedin: "normal"
    };
    this.things = {
      display: "block"
    }
  }

  join() {
    this.navCtrl.push(CreateProfile6);
  }

  hide() {
    this.things = {
      display: "none"
    }
  }

  show() {
    this.things = {
      display: "block"
    }
  }

  back() {
    this.navCtrl.pop();
  }

  update(a) {
    let obj = {};
    obj[a] = this[a];
    return this.api.updateProfile(obj).subscribe((status) => {
        this.status[a] += " success";
        setTimeout(() => this.navCtrl.push(CreateProfile6), 500);
      },
      (err) => {
        console.log(err)
      })
  }
}

@Component({
  template: `
    <ion-content class="blue white">
      <div class="nav-arrows">
        <ion-buttons>
          <button ion-button icon large clear class="back-btn" (click)="back()"><ion-icon name="arrow-back"></ion-icon>&nbsp;Back</button>
          <button ion-button icon large clear class="skip-btn" (click)="join()">Skip&nbsp;<ion-icon name="arrow-forward"></ion-icon></button>
        </ion-buttons>
      </div>
      <ion-icon *ngIf="!showImg" class="logo info" name="camera"></ion-icon>
      <h1 class="white info">Now let's add a profile picture</h1>
      <ion-buttons class="camera-btns">
        <button ion-button large color="secondary" (click)="take('library')">From Camera roll</button>
        <button ion-button large color="secondary" (click)="take('camera')">Take a Picture</button>
      </ion-buttons>
      <br>
      <button ion-button large color="secondary" *ngIf="showImg" (click)="upload()">Upload Picture</button>
    </ion-content>`,
  providers: [HttpService, Camera, Transfer, File]
})

export class CreateProfile6 {
  status;
  description;
  interests;
  facebook;
  phone;
  twitter;
  image;
  showImg;
  loading;
  things;

  constructor(public navParams: NavParams, public navCtrl: NavController, public api: HttpService, public camera: Camera, private transfer: Transfer, private file: File, private ds: DomSanitizer, public loadingCtrl: LoadingController) {
    this.status = {
      description: "normal",
      interests: "normal",
      facebook: "normal",
      phone: "normal",
      twitter: "normal",
      linkedin: "normal"
    };
    this.things = {
      display: "block"
    }
  }

  join() {
    this.navCtrl.push(CreateProfile7);
  }

  hide() {
    this.things = {
      display: "none"
    }
  }

  show() {
    this.things = {
      display: "block"
    }
  }

  back() {
    this.navCtrl.pop();
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
      targetWidth: 800,
      targetHeight: 800
    };
    this.camera.getPicture(options1).then((imageData) => {
      this.upload(imageData);
    }, (err) => {
      console.log(err);
    });
  }
  upload(image) {
    this.loading = this.loadingCtrl.create({
      content: "Uploading picture...",
      duration: 5000
    });
    console.log("uploading");
    this.loading.present();
    const fileTransfer: TransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: 'picture',
      fileName: 'image.jpg'
    };
    fileTransfer.upload(image, localStorage.getItem("apiURL") + "/api/updateProfilePicture/" + localStorage.getItem('token'), options)
      .then((res) => {
        this.completeImage(res);
      }, (err) => {
        console.log(err + " 868");
      })
  }
  completeImage(status) {
    console.log(status);
    if(JSON.parse(status.response).status === "success") {
      this.loading.dismiss();
      setTimeout(() => this.navCtrl.push(CreateProfile7), 500);
    }
    else {
      this.loading.dismiss();
    }
  }
}

@Component({
  template: `
    <ion-content class="blue white">
      <div class="nav-arrows">
        <ion-buttons>
          <button ion-button icon large clear class="back-btn" (click)="back()"><ion-icon name="arrow-back"></ion-icon>&nbsp;Back</button>
        </ion-buttons>
      </div>
      <ion-icon class="logo info" name="checkmark"></ion-icon>
      <h1 class="white info">Great! Almost There!</h1>
      <button ion-button large color="secondary" style="bottom: 100px; position: absolute; left: 0; right: 0; margin: auto; text-align: center;" (tap)="join()">Continue</button>
    </ion-content>`
})

export class CreateProfile7 {

  constructor(public navCtrl: NavController) {}

  join() {
    this.navCtrl.push(JoinEvent);
  }

  back() {
    this.navCtrl.pop();
  }
}
