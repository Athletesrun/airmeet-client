import {Component} from '@angular/core';
import {NgStyle} from '@angular/common';

import {HttpService} from '../../services/http.service';

import {NavController, NavParams} from 'ionic-angular';


@Component({
  templateUrl: 'person.html',
  providers: [NgStyle, HttpService],

})
export class Person {
  item;

  avatar(img) {
    return "background-image: url(" + img + ")";
  }

  constructor(params: NavParams) {
    this.item = params.data.item;
  }
}

@Component({templateUrl: "people.html", selector: "page-page1", providers: [HttpService]})
export class People {
  items:any;

  constructor(public nav: NavController, private api: HttpService) {
  }

  ngOnInit() {
    this.getPeople();
  }

  getPeople() {
    this.api.getAllProfiles().subscribe(
      (people) => {
        console.log(people);
        this.items = people;
      },
      (err) => {
         console.log(err)
      }
    )
  }

  openNavDetailsPage(item) {
    this.nav.push(Person, {item: item});
  }

}
