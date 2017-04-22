import { Component } from '@angular/core';

import { NavController, NavParams, Platform, LoadingController, Events } from 'ionic-angular';

import { SocketService } from '../../services/socket.service';

import { Storage } from '@ionic/storage'

import { Person } from '../people/people';
import { Organization } from '../organizations/organizations';

import { HttpService } from '../../services/http.service';


import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    LatLng,
    Marker
} from '@ionic-native/google-maps';

@Component({
    selector: 'map-page',
    templateUrl: 'map.html',
    providers: [
        GoogleMaps,
        HttpService
    ]
})

export class Map {

    public map: GoogleMap;

    private userId;

    private userToFind;
    private locations;

    private _pushProfile: (profileId: any) => void;

    constructor(public navCtrl: NavController, public navParams: NavParams, private googleMaps: GoogleMaps, public platform: Platform, public sockets: SocketService, public storage: Storage, private api: HttpService, public loadingCtrl: LoadingController, public events: Events) {

        this.storage.ready().then(() => {
            this.storage.get('userId').then((val) => {
                this.userId = parseInt(val);
            });
        });

        if(navParams.data) {

            if(navParams.data.personToFind) {
                this.userToFind = navParams.data.personToFind;
            }

            if(navParams.data.location) {
                this.locations = navParams.data.locations;
            }

        }

        platform.ready().then(() => {

            this.loadMap();
        });

    }

    ngOnInit():void {

        this._pushProfile = (profileId) => {

            this.pushProfile(profileId);

        };

        this.events.subscribe('map:clicked', this._pushProfile);

    }

    ngOnDestroy():void {

        this.events.unsubscribe('map:clicked', this._pushProfile);
        this._pushProfile = undefined;

    }

    pushProfile(profileId) {

        this.api.getUserProfile(parseInt(profileId)).subscribe((profile) => {

            this.navCtrl.push(Person, {
                item: profile
            });

        }, (err) => {
            console.log(err);
        });
    }

    loadMap() {
        const location = new LatLng(41.244184, -96.011941);

        this.map = new GoogleMap('map', {
            backgroundColor: 'white',
            controls: {
                'compass': true,
                'myLocationButton': true,
                'indoorPicker': true,
                'zoom': true
            },
            gestures: {
                'scroll': true,
                'tilt': false,
                'rotate': true,
                'zoom': true
            },
            camera: {
                'latLng': location,
                'tilt': 0,
                'zoom': 20,
                'bearing': 0
            }
        });

        this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {

            this.api.getAllOrganizations().subscribe((organizations) => {

                for (let i in organizations) {

                    if (organizations[i].lat && organizations[i].lng) {

                        let picture;

                        if (organizations[i].picture) {

                            picture = 'https://s3.us-east-2.amazonaws.com/airmeet-uploads/pictures/' + organizations[i].picture;

                        } else {

                            picture = 'https://s3.us-east-2.amazonaws.com/airmeet-uploads/organizations/organization.png'

                        }

                        const marker = this.map.addMarker({
                            position: new LatLng(organizations[i].lat, organizations[i].lng),
                            markerClick: (marker: Marker) => {

                                marker.hideInfoWindow();

                                this.navCtrl.push(Organization, {
                                    id: parseInt(marker.get('id'))
                                });

                            },
                            icon: {
                                //url: canvas.toDataURL(),
                                url: picture,
                                size: {
                                    height: 38,
                                    width: 38
                                }
                            }
                        }).then((marker: Marker) => {
                            marker.set('id', organizations[i].id);

                        });

                    }

                }

            }, (error) => {

                console.log(error);

            });

            this.sockets.addMap(this.map);

            if(this.userToFind) {

                this.sockets.findPersonOnMap(this.userToFind);
            }

            if(this.locations) {

                for (let i in this.locations) {
                    this.sockets.addMarkerToMap(this.locations[i]);
                }

                this.locations = undefined;

            } else {

                this.sockets.getAllLocationsAndAddToMap();

            }

            this.events.subscribe('menu:opened', () => {

                this.map.setClickable(false);

            });

            this.events.subscribe('menu:closed', () => {
                this.map.setClickable(true);
            });

        });
    }

}
