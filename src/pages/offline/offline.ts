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

    private checkInterval;

    constructor(private network: Network, public navCtrl: NavController, public menu: MenuController) {

        this.networkSubscription = this.network.onConnect().subscribe(() => {

            this.navCtrl.pop();

        });


    }

    ngOnInit() {

        this.checkInterval = setInterval(() => {

            if(this.network.type != 'none') {
                console.log(this.network.type);
                this.navCtrl.pop();
            }

        }, 5000);

    }

    ngAfterViewInit() {
        this.menu.swipeEnable(false, 'sideNavMenu');
    }

    ngOnDestroy() {

        clearInterval(this.checkInterval);

        this.networkSubscription.unsubscribe();

        this.menu.swipeEnable(true, 'sideNavMenu');
    }

}
