import { Component } from '@angular/core';

import { NavController, NavParams, Platform } from 'ionic-angular';

import { SocketService } from '../../services/socket.service';

import {Subscription} from 'rxjs/Subscription';

import { Storage } from '@ionic/storage'

import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    LatLng,
    CameraPosition,
    MarkerOptions,
    Marker
} from '@ionic-native/google-maps';

@Component({
    selector: 'map-page',
    templateUrl: 'map.html',
    providers: [
        GoogleMaps
    ]
})

export class Map {

    map: GoogleMap;

    private markers = [];
    private userId;

    public locationSubscription: Subscription;
    public removedLocationSubscription: Subscription;

    constructor(public navCtrl: NavController, public navParams: NavParams, private googleMaps: GoogleMaps, public platform: Platform, public sockets: SocketService, public storage: Storage) {
        this.storage.ready().then(() => {
          this.storage.get('userId').then((val) => {
            this.userId = parseInt(val);
          })
        })

        platform.ready().then(() => {
            this.loadMap();
        });

    }

    ngOnDestroy() {

        this.locationSubscription.unsubscribe();
        this.removedLocationSubscription.unsubscribe();

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

            /*this.map.addGroundOverlay({
                url: 'https://s3.us-east-2.amazonaws.com/airmeet-uploads/floorPlan.png',
                bounds: bounds,
                opacity: 1
            });*/

            this.locationSubscription = this.sockets.mapLocation$.subscribe((location) => {

                if(location.id.toString() !== localStorage.getItem('userId')) {
                    let hasMatched = false;

                    for (let i in this.markers) {

                        if (this.markers[i].id === location.id) {

                            hasMatched = true;

                            this.markers[i].marker.setPosition(new LatLng(location.lat, location.lng));

                            break;

                        }

                    }

                    if (hasMatched === false) {

                        const marker = this.map.addMarker({
                            position: new LatLng(location.lat, location.lng),
                            title: location.name
                        }).then((marker: Marker) => {

                            this.markers.push({
                                id: location.id,
                                marker: marker
                            })

                        });

                    }
                }

            });

            this.removedLocationSubscription = this.sockets.removedLocation$.subscribe((location) => {

                if(location.id.toString() !== this.userId) {

                    for (let i in this.markers) {

                        if (this.markers[i].id === location.id) {

                            this.markers[i].marker.remove();

                            this.markers.splice(parseInt(i), 1);

                            break;

                        }

                    }

                }

            });

            this.sockets.getAllLocations();

        });

        let bounds = [
            new LatLng(41.244076, -96.011664),
            new LatLng(41.244473, -96.012196),
        ];

    }

}
