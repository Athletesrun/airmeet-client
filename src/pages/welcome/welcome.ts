import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

import * as SHA2 from "../../services/sha.service";

import { HttpService } from '../../services/http.service';

@Component({selector: "welcome-page", templateUrl: "welcome.html", providers: [HttpService]})

export class Welcome {

    constructor(private api: HttpService, public navCtrl: NavController) {}

    Create(event, item){
        if (event === "Acct"){
            this.navCtrl.push(CreateAccount);
        }
        else if (event === "Sign"){
            this.navCtrl.push(signin);
        }
    }

}

@Component({templateUrl: "Profile-Creation.html"})
export class ProfileCreation{
  constructor(public navParams: NavParams, public navCtrl: NavController){}
  join() {
    this.navCtrl.push(JoinEvent);
  }
}

@Component({templateUrl: 'Create-Account.html', providers: [HttpService]})
export class CreateAccount {

    firstName; lastName; email; password; states;

    constructor(public navParams: NavParams, public navCtrl: NavController, public api: HttpService){
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
              this.navCtrl.push(ProfileCreation);
            }
          },
          (err) => {
            console.log(err)
          },
          () => {
          }
        )
      }
      console.log(this.firstName, this.lastName, this.email, this.password);
    }
}
@Component({templateUrl: 'sign-in.html'})

export class signin {

    constructor(public navParams: NavParams, public navCtrl: NavController){}

    create() {
        this.navCtrl.push(CreateAccount);
    }
    code() {
        this.navCtrl.push(CreateAccount);
    }
    join() {
        this.navCtrl.push(JoinEvent);
    }
}
@Component({templateUrl: 'Join-event.html'})

export class JoinEvent {

    constructor(public navParams: NavParams, public navCtrl: NavController){}

    joinEvent() {
        console.log("hello");
    }

}
