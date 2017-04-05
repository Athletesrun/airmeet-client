import { Component } from '@angular/core';

import { Network } from '@ionic-native/network';

import { NavController, MenuController } from 'ionic-angular';

@Component({
    selector: 'offline-element',
    templateUrl: 'offline.html',
    providers: [
        Network
    ]
})

export class Offline {

    networkSubscription;

    constructor(private network: Network, public navCtrl: NavController, public menu: MenuController) {

        this.networkSubscription = this.network.onConnect().subscribe(() => {

            this.navCtrl.pop();

        });


    }

    ngAfterViewInit() {
        this.menu.swipeEnable(false, 'sideNavMenu');
    }

    ngOnDestroy() {

        this.networkSubscription.unsubscribe();

        this.menu.swipeEnable(true, 'sideNavMenu');
    }

}
