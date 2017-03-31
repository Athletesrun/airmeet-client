import {Component} from '@angular/core';
import {NgStyle} from '@angular/common';

import {HttpService} from '../../services/http.service';

import {NavController, NavParams, ToastController} from 'ionic-angular';
import {Conversation} from "../messages/messages";


@Component({
  templateUrl: 'person.html',
  providers: [NgStyle, HttpService, ToastController],

})
export class Person {
  item;

  constructor(params: NavParams, public navCtrl: NavController, public api: HttpService, public toast: ToastController) {
    this.item = params.data.item;
  }

  Message(person) {
    console.log(person);
    this.navCtrl.push(Conversation, {
      person: person
    })
  }

  Save(person) {
    this.api.saveProfile(person.id).subscribe((res) => {
      if (res.status === "success") {
        let toast = this.toast.create({
          message: 'Profile has been saved!',
          duration: 3000
        });
        toast.present();
      }
      else console.log(res);
    },
      (err) => {
        console.log(err);
      }
    );
  }

  avatar(img) {
    return "background-image: url(" + img + ")";
  }

}

@Component({templateUrl: "people.html", selector: "people", providers: [HttpService]})
export class People {

  items:any;

  isSearching:boolean;

  element:any;

  private updatePeopleInterval;

  private userId = localStorage.getItem('userId');

  constructor(public nav: NavController, private api: HttpService) {
  }

  ngOnInit() {
    this.getPeople();

    this.updatePeopleInterval = setInterval(() => {
      this.getPeople();
    }, 5000);
  }

  ngOnDestroy() {

    clearInterval(this.updatePeopleInterval);

  }

  search(ev: any) {
    let val = ev.target.value;

    console.log(val);

    if (val !== "" && val !== undefined) {
      this.isSearching = true;
      this.element = ev.target;

      this.api.searchUsers(val).subscribe(
        (people) => {
          this.items = people.results;
        }
      )
    }
    else {
      this.isSearching = false;
      this.getPeople();
    }
  }

  getPeople() {
    this.api.getAllProfiles().subscribe(
      (people) => {
        if (!this.isSearching) {
          this.items = people;
        }
        else {
          if (this.element.val) {
            this.items = people;
          }
        }
      },
      (err) => {
         console.log(err)
      },
      () => {

      }
    )
  }

  openNavDetailsPage(item) {
    this.nav.push(Person, {item: item});
  }

}
