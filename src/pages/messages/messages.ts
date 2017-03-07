import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content} from 'ionic-angular';

import { HttpService } from '../../services/http.service';

@Component({
	templateUrl: "conversations.html",
	providers: [
		HttpService
	]
})

export class Conversation {

	private messages;
	private person;

	private userId = JSON.parse(localStorage.getItem('userId')).userId;

	constructor(params: NavParams, private api: HttpService) {

		this.messages = params.data.messages;
		this.person = params.data.person;

	}

	//@todo order messages within conversation and in messages page

	ngAfterViewInit() {

		setTimeout(() => {
			this.scrollToBottom(0);
		}, 100);
	}

	ngOnInit() {


		//@todo make the interval work and close it
		setInterval(this.updateMessages(), 1000);

	}

	sendMessage(event) {

		let message = (<HTMLInputElement>document.querySelector('.text-input')).value;

		this.api.sendMessage(this.person.id, message).subscribe(() => {

			(<HTMLInputElement>document.querySelector('.text-input')).value = "";

			this.messages.push({
				message: message,
				sender: this.userId,
				receiver: this.person.id
			});

			setTimeout(() => {
				this.scrollToBottom(500);
			}, 50);

		}, (err) => {

			alert("An error occured");

		});

	}

	updateMessages() {

		this.api.getMessages().subscribe((messages) => {

			this.messages = messages[this.person.id];

			console.log(this.messages);

		}, () => {
			alert('An error has occured');
		});

	}

	@ViewChild(Content) content: Content;


	scrollToBottom(duration) {
		this.content.scrollToBottom();
	}

}

@Component({selector: 'messages', providers: [HttpService], templateUrl: 'messages.html'})

export class Messages {

	selectedItem: any;
	items: Array<{name: string, lastMessage: string}>;

	private profiles;

	private conversations;

	private lastMessages = {};

	constructor(public navCtrl: NavController, public navParams: NavParams, private api: HttpService) {}

	ngOnInit() {

		this.getUsers();

		setInterval(() => {
			this.getUsers();
		}, 1000);

	}

	itemTapped(userId, index) {

		this.navCtrl.push(Conversation, {
			person: this.profiles[index],
			messages: this.conversations[userId]
		});
	}

	getUsers() {

		this.api.getMessages().subscribe((messages) => {

			this.conversations = messages;

			let conversations = Object.keys(messages);

			let profilesToComplete = conversations.length;
			let profilesCompleted = 0;

			let profiles = [];

			for(let i in conversations) {

				this.api.getUserProfile(parseInt(conversations[i])).subscribe((profile) => {

					this.lastMessages[conversations[i]] = messages[conversations[i]][conversations[i].length -1].message;

					profiles.push(profile);

					profilesCompleted++;

					if(profilesCompleted === profilesToComplete) {

						this.profiles = profiles;
					}

				}, (err) => {
					console.log(err);
				});

			}

		}, (err) => {
			console.log(err);
		});

	}

}
