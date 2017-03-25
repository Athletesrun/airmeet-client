import { Component } from '@angular/core';
import { NavController, Content, NavParams} from 'ionic-angular';

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
@Component({templateUrl: 'Create-Account.html'})
export class ProfileCreation{
  constructor(public navParams: NavParams, public navCtrl: NavController){}
  join() {
    this.navCtrl.push(JoinEvent);
  }
}
export class CreateAccount {

    constructor(public navParams: NavParams, public navCtrl: NavController){}
    create(){
        this.navCtrl.push(signin);
    }
    join() {
        this.navCtrl.push(ProfileCreation);
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
