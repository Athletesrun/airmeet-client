import { Component, ViewChild } from '@angular/core';

import { NavController, NavParams, Platform } from 'ionic-angular';

import { SocketService } from '../../services/socket.service';

import {Subscription} from 'rxjs/Subscription';

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

    private populateInterval;

    private markers = [];

    public subscription: Subscription;

    constructor(public navCtrl: NavController, public navParams: NavParams, private googleMaps: GoogleMaps, public platform: Platform, public sockets: SocketService) {

        platform.ready().then(() => {
            this.loadMap();
        });

        this.subscription = this.sockets.mapLocation$.subscribe((location) => {
            console.log(location);
        });

    }

    ngOnDestroy() {

        this.subscription.unsubscribe();

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

            this.map.addGroundOverlay({
                url: 'https://s3.us-east-2.amazonaws.com/airmeet-uploads/floorPlan.png',
                bounds: bounds,
                opacity: 1
            });

        });

        let bounds = [
            new LatLng(41.244076, -96.011664),
            new LatLng(41.244473, -96.012196),
        ];

        this.sockets.getAllLocations();

    }

    /*populateMap() {

        this.populateInterval = setInterval(() => {
            this.sockets.getLocations((locations) => {

                console.log(locations);

                for(let i in locations) {

                    let hasMatched = false;

                    for(let x in this.markers) {
                        if(locations[i].id === this.markers[x].id) {

                            hasMatched = true;
                            this.markers[x].setPosition(new LatLng(locations[i].lat, locations[i].lng));

                        }
                    }

                    if(hasMatched === false) {

                        const marker = this.map.addMarker({
                            position: new LatLng(locations[i].lat, locations[i].lng),
                            title: locations[i].id
                        }).then((marker: Marker) => {

                            this.markers.push({
                                id: locations[i].id,
                                marker: marker
                            })

                        });

                    }

                }
            });
        }, 500);

    }*/



    removeLocation(userId) {

        if(userId !== localStorage.getItem('userId')) {

            for (let i in this.markers) {

                if (this.markers[i].id === userId) {

                    this.markers[i].marker.remove();

                    this.markers.splice(parseInt(i), 1);

                }

            }

        }

    }

    public addLocation(data) {

        let hasMatched = false;

        for(let i in this.markers) {

            if(this.markers[i].id === data.id) {

                hasMatched = true;

                this.markers[i].setPosition(new LatLng(data.lat, data.lng));

            }

        }

        if(hasMatched === false) {

            const marker = this.map.addMarker({
                position: new LatLng(data.lat, data.lng),
                title: data.name
            }).then((marker: Marker) => {

                this.markers.push({
                    id: data.id,
                    marker: marker
                })

            });

        }

    }

}
