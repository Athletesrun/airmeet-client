import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import {HttpService} from "../../services/http.service";
import {Conversation} from "../messages/messages"

@Component({
    selector: 'saved-messaged',
    templateUrl: 'savedMessages.html',
    providers: [HttpService]
})

export class SavedMessages {

    conversations; noConversations;

    constructor(public navCtrl: NavController, public navParams: NavParams, private api: HttpService) {
      this.noConversations = false
    }

    conversationTapped(user) {
      this.navCtrl.push(Conversation, {
        person: user
      });
    }

    ngOnInit() {
      this.update()
    }

  ionViewWillEnter() {
    console.log("works?");

  }

  update() {
    this.api.getSavedConversations().subscribe((res) => {
      console.log("hai");
      console.log(res);
      this.conversations = res;
      if (res.length === 0) {
        this.noConversations = true
      }
      else this.noConversations = false
    })
  }

}
