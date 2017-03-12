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

  private updatePeopleInterval;

  private userId = localStorage.getItem('userId');

  constructor(public nav: NavController, private api: HttpService) {
  }

  ngOnInit() {
    this.getPeople();

    this.updatePeopleInterval = setInterval(() => {
      this.getPeople();
    }, 3000);
  }

  ngOnDestroy() {

    clearInterval(this.updatePeopleInterval);

  }

  getPeople() {
    this.api.getAllProfiles().subscribe(
      (people) => {
        var peopletemp = [];
        for (var i in people) {
          if (people[i].id !== this.userId) {
            peopletemp.push(people[i]);
          }
        }
        this.items = peopletemp;
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
