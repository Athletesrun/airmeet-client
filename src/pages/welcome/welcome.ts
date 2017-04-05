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
  status; description; interests; facebook; phone; twitter; image; showImg; loading;
  constructor(public navParams: NavParams, public navCtrl: NavController, public api: HttpService, public camera: Camera, private transfer: Transfer, private file: File, private ds: DomSanitizer, public loadingCtrl: LoadingController){
    this.status = {
      description: "normal",
      interests: "normal",
      facebook: "normal",
      phone: "normal",
      twitter: "normal",
      linkedin: "normal"
    };
  }
  join() {
    this.navCtrl.push(JoinEvent);
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
  upload(image) {
    this.loading = this.loadingCtrl.create({
      content: "Uploading picture..."
    });
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
    if(status.json().status === "success") {
      this.loading.dismiss();
      setTimeout(() => this.slides.slideNext(), 500);
    }
  }
  update(a) {
    let obj = {};
    obj[a] = this[a];
    this.api.updateProfile(obj).subscribe((status) => {
        console.log(status);
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

              this.navCtrl.push(ProfileCreation);

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
      console.log(this.firstName, this.lastName, this.email, this.password);
    }
}
@Component({templateUrl: 'sign-in.html', providers: [HttpService]})

export class signin {

    email; password; states;

    constructor(public navParams: NavParams, public navCtrl: NavController, public api: HttpService, public storage: Storage){
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

              console.log(response);
              this.storage.set("userId", response.id);
              localStorage.setItem("userId", response.id);
              this.storage.set("token", response.token);
              localStorage.setItem("token", response.token);
              this.storage.set('signedIn', "true");
              localStorage.setItem('signedIn', "true");
              this.navCtrl.push(JoinEvent);

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

  status;

    constructor(public navParams: NavParams, public navCtrl: NavController, public api: HttpService, public storage: Storage){
      this.status = "normal"
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
                console.log(ip);
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

