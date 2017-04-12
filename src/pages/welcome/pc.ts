import {Component} from "@angular/core";
import {HttpService} from "../../services/http.service";
import {Transfer} from "@ionic-native/transfer";
import {File} from '@ionic-native/file';
import {LoadingController, NavController, NavParams} from "ionic-angular";
import {DomSanitizer} from "@angular/platform-browser";
import {Camera, /*CameraOptions*/} from "@ionic-native/camera";
/**
 * Created by Daniel Noon on 4/11/2017.
 */

@Component({
  template: `
    <ion-content class="blue white">
      <h1 [ngStyle]='things' class="heading2">Nice! Now let's add some information to your profile</h1>
      <h2 [ngStyle]='things' class="white info"
          style="position: absolute; right: 0; left: 0; margin: auto; text-align: center;">Add a description</h2>
      <ion-input [ngClass]="status.description" (focus)="hide()" (blur)="show()" class="textbox" type="text" maxlength="180"
                 [(ngModel)]="description" placeholder="Description of you" value=""></ion-input>
      <div class="flex">
        <button ion-button class="button2" (click)="update('description', 180)" large color="secondary">Add</button>
      </div>
      <p class="bottom" [ngClass]="status.description">Swipe Left to Skip</p>
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
      <ion-icon [ngStyle]='things' class="logo info" name="call"></ion-icon>
      <h1 [ngStyle]='things' class="white info">Add a phone number</h1>
      <ion-input class="textbox" [(ngModel)]="phone" (focus)="hide()" (blur)="show()" [ngClass]="status.phone"
                 type="number" placeholder="Phone number" value=""></ion-input>
      <div class="flex">
        <button ion-button class="button2" (click)="update('phone', 7)" large color="secondary">Add</button>
      </div>
      <p class="bottom" [ngClass]="status.phone">Swipe Left To Skip</p>
    </ion-content>`,
  providers: [HttpService, Camera, Transfer, File]
})
export class CreateProfile2 {
  status;
  description;
  things;
  api;

  constructor(private navCtrl: NavController) {}

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
        ///setTimeout(() => this.navCtrl.push(), 500);
      },
      (err) => {
        console.log(err)
      })
  }
}
