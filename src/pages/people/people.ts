import {Component} from '@angular/core';
import {NgStyle} from '@angular/common';

import {NavController, NavParams} from 'ionic-angular';


@Component({
  templateUrl: 'person.html',
  providers: [NgStyle]
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

@Component({templateUrl: "people.html",selector: "page-page1"})
export class People {
  items = [];

  constructor(public nav: NavController) {
    this.items = [
      {
        'title': 'Ben Wingerter',
        'icon': 'angular',
        'avatar': "http://placehold.it/350x150",
        'description': 'A powerful Javascript framework for building single page apps. Angular is open source, and maintained by Google.',
        'color': '#E63135'
      },
      {
        'title': 'CSS3',
        'icon': 'css3',
        'avatar': "http://placehold.it/350x150",
        'description': 'The latest version of cascading stylesheets - the styling language of the web!',
        'color': '#0CA9EA'
      },
      {
        'title': 'HTML5',
        'icon': 'html5',
        'avatar': "http://placehold.it/350x150",
        'description': 'The latest version of the web\'s markup language.',
        'color': '#F46529'
      },
      {
        'title': 'JavaScript',
        'icon': 'javascript',
        avatar: "http://placehold.it/350x150",
        'description': 'One of the most popular programming languages on the Web!',
        'color': '#FFD439'
      },
      {
        'title': 'Sass',
        'icon': 'sass',
        avatar: "http://placehold.it/350x150",
        'description': 'Syntactically Awesome Stylesheets - a mature, stable, and powerful professional grade CSS extension.',
        'color': '#CE6296'
      },
      {
        'title': 'NodeJS',
        'icon': 'nodejs',
        avatar: "http://placehold.it/350x150",
        'description': 'An open-source, cross-platform runtime environment for developing server-side Web applications.',
        'color': '#78BD43'
      },
      {
        'title': 'Python',
        'icon': 'python',
        avatar: "http://placehold.it/350x150",
        'description': 'A clear and powerful object-oriented programming language!',
        'color': '#3575AC'
      },
      {
        'title': 'Markdown',
        'icon': 'markdown',
        avatar: "http://placehold.it/350x150",
        'description': 'A super simple way to add formatting like headers, bold, bulleted lists, and so on to plain text.',
        'color': '#412159'
      },
      {
        'title': 'Tux',
        'icon': 'tux',
        avatar: "http://placehold.it/350x150",
        'description': 'The official mascot of the Linux kernel!',
        'color': '#000'
      },
    ]
  }

  openNavDetailsPage(item) {
    this.nav.push(Person, {item: item});
  }

}
