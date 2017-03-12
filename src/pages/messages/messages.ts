import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content} from 'ionic-angular';

import { HttpService } from '../../services/http.service';

@Component({templateUrl: "conversation.html", providers: [HttpService]})

//@todo implement fob

export class Conversation {

	private messages;
	private person;
	private updateInterval;

	private userId = parseInt(localStorage.getItem('userId'));

	constructor(params: NavParams, private api: HttpService) {
		this.person = params.data.person;

	}

	//@todo order messages within conversation and in messages page

	ngAfterViewInit() {

		setTimeout(() => {
			this.scrollToBottom(0);
		}, 100);
	}

	ngOnInit() {

		this.updateMessages();

		this.updateInterval = setInterval(() => {
			this.updateMessages();
		}, 1000);

	}

	ngOnDestroy() {

		clearInterval(this.updateInterval);

	}

	sendMessage(event) {

		let message = (<HTMLInputElement>document.querySelector('.text-input')).value.trim();

		if(message !== "") {

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

				console.log(err);
				alert("An error occured");

			});

		}

	}

	updateMessages() {

		this.api.getConversation(this.person.id).subscribe((messages) => {

			this.messages = messages;

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

	private conversations;

	private getUsersInterval;

	constructor(public navCtrl: NavController, public navParams: NavParams, private api: HttpService) {}

	ngOnInit() {

		this.getUsers();

		this.getUsersInterval = setInterval(() => {
			this.getUsers();
		}, 1000);

	}

	ngOnDestroy() {

		clearInterval(this.getUsersInterval);

	}

	itemTapped(userId, index) {

		this.navCtrl.push(Conversation, {
			person: this.conversations[index],
		});
	}

	getUsers() {

		this.api.getMessageList().subscribe((conversations) => {

			this.conversations = conversations;

		}, (err) => {
			console.log(err);
		});

	}

}
