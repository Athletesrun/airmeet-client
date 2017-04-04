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

    conversations;

    constructor(public navCtrl: NavController, public navParams: NavParams, private api: HttpService) {

    }

    conversationTapped(user) {
      this.navCtrl.push(Conversation, {
        person: user
      })
    }

    ngOnInit() {
      this.api.getSavedConversations().subscribe((res) => {
        console.log(res)
        this.conversations = res;
      })
    }

}
