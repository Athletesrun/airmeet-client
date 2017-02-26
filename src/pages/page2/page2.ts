import { Component } from '@angular/core';

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

@Component({selector: 'page-page2', templateUrl: 'page2.html'})

export class Page2 {
  selectedItem: any;
  items: Array<{name: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.items = [
        {name: "Carl"}
    ];
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(Page2, {
      item: item
    });
  }
}
