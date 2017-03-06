import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { HttpService } from '../../services/http.service';

@Component({
	templateUrl: "conversations.html"
})

export class Conversation {

	private messages;
	private test;
	private person;

	constructor(params: NavParams) {
		this.messages = params.data.messages;
		this.test = params.data.test;
		this.person = params.data.person;

	}

}

@Component({selector: 'messages', providers: [HttpService], templateUrl: 'messages.html'})

export class Messages {

	selectedItem: any;
	items: Array<{name: string, lastMessage: string}>;

	private conversations;

	private lastMessages = {};

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
			messages: this.conversations,
			test: "ben",
			person: "Ben"
		});
	}

	getUsers() {

		this.api.getMessages().subscribe((messages) => {

			let conversations = Object.keys(messages);

			console.log(conversations);

			let conversationsToComplete = conversations.length;
			let conversationsCompleted = 0;

			let namedConversations = [];

			for(let i in conversations) {

				this.api.getUserProfile(parseInt(conversations[i])).subscribe((profile) => {

					this.lastMessages[conversations[i]] = messages[conversations[i]][conversations[i].length -1].message;

					namedConversations.push(profile);

					conversationsCompleted++;

					if(conversationsCompleted === conversationsToComplete) {

						console.log(namedConversations);

						this.conversations = namedConversations
					}

				}, (err) => {
					console.log(err);
				});

			}

			console.log(messages);

			this.conversations = conversations;

		}, (err) => {
			console.log(err);
		}, () => {
			console.log('complete');
		});

	}

}
