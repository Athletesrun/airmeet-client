import { Component } from '@angular/core';

import { Http } from '@angular/http';

import { NavController, NavParams } from 'ionic-angular';

@Component({
    templateUrl: "conversations.html"
})

export class Conversation {
    item;
    constructor(params: NavParams) {
        this.item = params.data.item;
    }
}

@Component({selector: 'page-page2', templateUrl: 'messages.html'})

export class Messages {

    selectedItem: any;
    items: Array<{name: string, lastMessage: string}>;

    private apiURL = "http://localhost:8080/api/getMessages";

    constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http) {
        // If we navigated to this page, we will have an item available as a nav param
        this.selectedItem = navParams.get('item');

        this.items = [
            {name: "Carl", lastMessage: "Ugh. As if."},
            {name: "Ban", lastMessage: "Donald Trump"}
        ];
    }

    itemTapped(event, item) {
        // That's right, we're pushing to ourselves!
        this.navCtrl.push(Conversation, {
        item: item
        });
    }

    getUsers() {

        /*return this.http.post(this.apiURL).toPromise().then((response) => {

            console.log(response);

        }).catch(this.handleError);*/

        return [
            {name: "ben"},
            {name: "jim"}
        ];

    }

}
