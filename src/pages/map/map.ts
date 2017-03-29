import { Component, ViewChild } from '@angular/core';

import { NavController, NavParams, Platform } from 'ionic-angular';

import { SocketService } from '../../services/socket.service';

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

    constructor(public navCtrl: NavController, public navParams: NavParams, private googleMaps: GoogleMaps, public platform: Platform, public sockets: SocketService) {
        platform.ready().then(() => {
            this.loadMap();
        })
    }

    ngOnInit() {

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

            alert('ben');

            this.map.addGroundOverlay({
                url: 'https://s3.us-east-2.amazonaws.com/airmeet-uploads/floorPlan.png',
                bounds: bounds,
                opacity: 1
            });

            this.populateMap();

        });

        let bounds = [
            new LatLng(41.244076, -96.011664),
            new LatLng(41.244473, -96.012196),
        ];

    }

    populateMap() {

        this.sockets.getLocations((locations) => {

            //let markerPosition = new LatLng(lat, lng);

            /*const marker = this.map.addMarker({
                position: markerPosition,
                title: 'Ben'
            }).then((marker: Marker) => {


            });*/
        });

    }

}
