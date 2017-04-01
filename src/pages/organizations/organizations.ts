import {Component} from '@angular/core';
import {NgStyle} from '@angular/common';

import {HttpService} from '../../services/http.service';

import {NavController, NavParams, ToastController} from 'ionic-angular';


@Component({
  templateUrl: 'organization.html',
  providers: [NgStyle, HttpService, ToastController],

})
export class Organization {
  constructor(params: NavParams, public navCtrl: NavController, public api: HttpService, public toast: ToastController) {
  }
}


@Component({templateUrl: "organizations.html", selector: "people", providers: [HttpService]})
export class Organizations {

  private organizations;

  private userId = localStorage.getItem('userId');

  constructor(public nav: NavController, private api: HttpService) {
  }

  ngOnInit() {


  }

  ngOnDestroy() { }

}
