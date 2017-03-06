import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { HttpService } from '../../services/http.service';

@Component({
	templateUrl: "conversations.html"
})

export class Conversation {
	item;
	constructor(params: NavParams) {
		this.item = params.data.item;
	}
}

@Component({selector: 'page-page2', providers: [HttpService], templateUrl: 'messages.html'})

export class Messages {

	selectedItem: any;
	items: Array<{name: string, lastMessage: string}>;

	constructor(public navCtrl: NavController, public navParams: NavParams, private api: HttpService) {
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

		console.log(this.api.getMessages());

		return [
			{name: "ben"},
			{name: "jim"}
		];

	}

}
