import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

import * as SHA2 from "../../services/sha.service";

import { HttpService } from '../../services/http.service';
import {People} from "../people/people";

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

                localStorage.setItem('token', response.token);
                localStorage.setItem('signedIn', "true");

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
          },
          () => {
          }
        )
      }
      console.log(this.firstName, this.lastName, this.email, this.password);
    }
}
@Component({templateUrl: 'sign-in.html', providers: [HttpService]})

export class signin {

    email; password; states;

    constructor(public navParams: NavParams, public navCtrl: NavController, public api: HttpService){
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

              localStorage.setItem("userId", response.id);
              localStorage.setItem("token", response.token);
              this.navCtrl.push(JoinEvent);

            }
            else {
              this.states.email = "error";
              this.states.password = "error";
            }
          }
        )
      }
    }
}
@Component({templateUrl: 'Join-event.html', providers: [HttpService]})

export class JoinEvent {

  status;

    constructor(public navParams: NavParams, public navCtrl: NavController, public api: HttpService){
      this.status = "normal"
    }

    joinEvent(event) {
        let ip = event.target.value;
        if (ip) {
          if (ip.length === 8) {
            this.api.joinEvent(ip).subscribe(
              (res) => {
                console.log(ip);
                if (res.status === "success") {
                  localStorage.setItem("event", res.eventId);
                  localStorage.setItem("inEvent", "true");
                    localStorage.setItem("shareLocation", "true");
                  this.navCtrl.setRoot(People);
                }
                else {
                  this.status = "error";
                  console.log(res);
                }
              }
            )
          }
          else this.status = "normal";
        }
    }

}
