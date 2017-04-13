import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import {Keyboard} from '@ionic-native/keyboard';

import { HttpService } from '../../services/http.service';
import { Storage } from '@ionic/storage'
import { ToastController } from 'ionic-angular';

import { Directive, HostListener, ElementRef } from "@angular/core";



@Directive({
  selector: "ion-textarea[autoresize]" // Attribute selector
})

export class Autoresize {

  @HostListener("input", ["$event.target"])

  onInput(textArea: HTMLTextAreaElement): void {
    this.adjust();
  }

  constructor(public element: ElementRef) {

  }

  ngOnInit(): void {
    this.adjust();
  }

  adjust(): void {
    let ta = this.element.nativeElement.querySelector("textarea");
    if (ta) {
      ta.style.overflow = "hidden";
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    }
  }

}

@Component({templateUrl: "conversation.html", providers: [HttpService, ToastController, Autoresize, Keyboard]})
export class Conversation {

	private messages;
	private person;
	private updateInterval;
	saved;
	focused;
	height;
	private iv;

	private viewHeight;

	private alreadyScrolledToBottom = false;

	private userId;

	private typedMessage;

	private keepFocused;

  constructor(public navCtrl: NavController, public navParams: NavParams, private api: HttpService, public storage: Storage, public toast: ToastController, private resize: Autoresize, private keyboard: Keyboard) {
    this.person = navParams.data.person;
    this.focused = false;
    this.keepFocused = false;

    this.storage.ready().then(() => {
      this.storage.get('userId').then((val) => {
        this.userId = parseInt(val);
      })
    });

    this.height = "0";
    let body = <HTMLBodyElement>document.querySelector("body");
    this.viewHeight = body.offsetHeight;
    body.addEventListener("resize", () => {
    	console.log(resize);
	})

    this.keyboard.disableScroll(true);

	this.keyboard.onKeyboardShow().subscribe((event) => {
		this.fix(event.keyboardHeight);
		this.scrollToBottom(500);
	});

	this.keyboard.onKeyboardHide().subscribe((event) => {
		this.height = "0";
		this.scrollToBottom(500);
	});
  }

  fix(height) {
  	console.log("fix() is run");
    this.height = height;
  }

  fixScrolling() {
  	let style = {
		bottom: String(this.height) + "px"
	};
    return style
  }

  fixScrolling1() {
  	let height = "calc(100% - " + this.height + "px" + /*document.getElementById("message-footer").offsetHeight + "px*/")";
  	return {
  		height: height
	}
  }

  add() {
    console.log("hello");
    this.focused = true;
    this.keepFocused = true;
  }

  remove() {
    console.log("good bye");
    this.focused = false;
  }

  updateSave() {
    this.api.checkIfSavedConversation(this.person.id).subscribe((res) => {
      console.log(res);
      this.saved = res.status;
    }, (error) => {
    	console.log(error);
	})
  }

  stopFocus() {
  	this.keepFocused = false;
	  let input = <HTMLInputElement>document.getElementById("message-input").children[0];
	  input.blur();
  }

  unSave() {
    this.api.unsaveConversation(this.person.id).subscribe((res) => {
      console.log(res);
      if (res.status === "success") {
        let toast = this.toast.create({
          message: 'Conversation has been removed!',
          duration: 3000
        });
        toast.present();
        this.updateSave();
      }
      else console.log(res);
    },
    (err) => {
      console.log(err);
    })
  }

  save() {
    this.api.saveConversation(this.person.id).subscribe((res) => {
      console.log(res);
        if (res.status === "success") {
          let toast = this.toast.create({
            message: 'Conversation has been saved!',
            duration: 3000
          });
          toast.present();
          this.updateSave();
        }
        else console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

	ngOnInit() {

		this.updateMessages();
		this.updateSave();

		this.updateInterval = setInterval(() => {
			this.updateMessages();
		}, 1200);

		this.iv = setInterval(() => {
			if(this.keepFocused) {
				let input = <HTMLInputElement>document.getElementById("message-input").children[0];
				input.focus();
			}
		});


	}

	ngOnDestroy() {
		clearInterval(this.updateInterval);
		clearInterval(this.iv);
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

		let message = this.typedMessage.trim();

		let input = <HTMLInputElement>document.getElementById("message-input").children[0];
		input.focus();

		if(message !== "") {

			this.api.sendMessage(this.person.id, message).subscribe(() => {

				this.typedMessage = "";

				this.messages.push({
					message: message,
					sender: this.userId,
					receiver: this.person.id
				});

				setTimeout(() => {
					this.scrollToBottom(500);
					this.resize.adjust();
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



@Component({selector: 'newConversation', providers: [HttpService], templateUrl: 'newConversation.html'})

export class NewConversation {

	private profiles;

	constructor(public navCtrl: NavController, public navParams: NavParams, private api: HttpService) {}

	ngOnInit() {

		this.api.getAllProfiles().subscribe((profiles) => {

			this.profiles = profiles

		}, (error) => {

			console.log(error);

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

	private typedMessage;

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

		let message = this.typedMessage.trim();

		if(message !== "") {

			this.api.sendMessage(this.person.id, message).subscribe(() => {

				this.typedMessage = "";

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

	private conversations:any = [];

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
