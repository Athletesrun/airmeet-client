import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';

import { HttpService } from '../../services/http.service';
import { Storage } from '@ionic/storage'

@Component({templateUrl: "conversation.html", providers: [HttpService]})
export class Conversation {

	private messages;
	private person;
	private updateInterval;

	private alreadyScrolledToBottom = false;

	private userId;

  constructor(public navCtrl: NavController, public navParams: NavParams, private api: HttpService, public storage: Storage) {
    this.person = navParams.data.person;

    this.storage.ready().then(() => {
      this.storage.get('userId').then((val) => {
        this.userId = parseInt(val);
      })
    })
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

	needToScrollToBottom() {

		if(this.alreadyScrolledToBottom) {
			return false;
		} else {
			this.alreadyScrolledToBottom = true;
			return true;
		}

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

			});

		}

	}

	updateMessages() {//hi

		this.api.getConversation(this.person.id).subscribe((messages) => {

      console.log(messages);
			this.messages = messages;


		}, (err) => {

			console.log('err');

		});

	}

	@ViewChild(Content) content: Content;


	scrollToBottom(duration) {
		this.content.scrollToBottom(duration);
	}

}



@Component({selector: 'newConversation', providers: [HttpService], templateUrl: 'newConversation.html'})

export class NewConversation {

	private profiles;

	constructor(public navCtrl: NavController, public navParams: NavParams, private api: HttpService) {}

	ngOnInit() {

		this.api.getAllProfiles().subscribe((profiles) => {

			this.profiles = profiles

		});

	}

	selectProfile(id, i) {

		this.navCtrl.push(NewConversationMessage, {
			person: this.profiles[i]
		});

	}

}

@Component({selector: 'newConversationMessage', providers: [HttpService], templateUrl: 'newConversationMessage.html'})

export class NewConversationMessage {

	private person;
	private messages;
	private updateInterval;
	private userId;

	private alreadyScrolledToBottom = false;

	constructor(public navCtrl: NavController, public navParams: NavParams, private api: HttpService, public storage: Storage) {
		this.person = navParams.data.person;
		this.storage.ready().then(() => {
		  this.storage.get('userId').then((val) => {
		    this.userId = parseInt(val);
      })
    })
	}

	needToScrollToBottom() {

		if(this.alreadyScrolledToBottom) {
			return false;
		} else {
			this.alreadyScrolledToBottom = true;
			return true;
		}

	}

	ngOnInit() {

		this.updateMessages();

		this.updateInterval = setInterval(() => {
			this.updateMessages();
		}, 1000);

	}

	ngOnDestroy() {

		clearInterval(this.updateInterval);
		this.navCtrl.popToRoot();

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

			});

		}

	}

	updateMessages() {

		this.api.getConversation(this.person.id).subscribe((messages) => {

			this.messages = messages;

		}, (err) => {

			console.log(err);
		});


	}



	@ViewChild(Content) content: Content;


	scrollToBottom(duration) {
		this.content.scrollToBottom(duration);
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

	conversationTapped(userId, index) {

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

	newConversation() {
		this.navCtrl.push(NewConversation);
	}

}
