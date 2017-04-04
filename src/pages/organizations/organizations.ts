import {Component} from '@angular/core';

import {HttpService} from '../../services/http.service';

import {NavController, NavParams, ToastController} from 'ionic-angular';


@Component({
templateUrl: 'organization.html',
providers: [HttpService],
})
export class Organization {

    private organizationId;
    private organizationName;
    private organizationPicture;
    private organizationDescription;
    private organizationWebsite;

    constructor(params: NavParams, public navCtrl: NavController, public api: HttpService) {

        this.organizationId = params.data.id;

    }

    ngOnInit() {

        this.api.getOrganization(this.organizationId).subscribe((organization) => {

            this.organizationName = organization.name;
            this.organizationPicture = organization.picture;
            this.organizationDescription = organization.description;
            this.organizationWebsite = organization.website;

        }, (err) => {
            console.log(err);
        })

    }
}


@Component({templateUrl: "organizations.html", selector: "people", providers: [HttpService]})
export class Organizations {

    private organizations;

    private userId = localStorage.getItem('userId');

    constructor(public nav: NavController, private api: HttpService) { }

    ngOnInit() {

        this.api.getAllOrganizations().subscribe((organizations) => {

            this.organizations = organizations;

        }, (err) => {
            console.log(err);
        });

    }

    ngOnDestroy() { }

    open(organizationId) {

        this.nav.push(Organization, {
            id: organizationId
        });

    }

}
