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

	private conversations;

	constructor(public navCtrl: NavController, public navParams: NavParams, private api: HttpService) {
		// If we navigated to this page, we will have an item available as a nav param
		this.selectedItem = navParams.get('item');

		this.items = [
			{name: "Carl", lastMessage: "Ugh. As if."},
			{name: "Ban", lastMessage: "Donald Trump"}
		];
	}

	ngOnInit() {

		this.getUsers();

	}

	itemTapped(event, item) {
		// That's right, we're pushing to ourselves!
		this.navCtrl.push(Conversation, {
			item: item
		});
	}

	getUsers() {

		this.api.getMessages().subscribe((messages) => {

			let conversations = Object.keys(messages);

			this.conversations = conversations;

		}, (err) => {
			console.log(err);
		}, () => {
			console.log('complete');
		});

	}

}
