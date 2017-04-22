import {Injectable} from '@angular/core';
import { Subject } from 'rxjs/Subject';

import * as io from 'socket.io-client';

import { HttpService } from './http.service';

import { Location } from '../models/location.model';

import { Events } from 'ionic-angular';

import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    LatLng,
    Marker
} from '@ionic-native/google-maps';

@Injectable()
export class SocketService {

    private socket: SocketIOClient.Socket;

    private mapInterval;

    private sharingLocation;

    private map: GoogleMap;

    private markers = [];

    private isInitialized = false;

    constructor(public api: HttpService, public events: Events) {

        this.socket = io.connect(localStorage.getItem('socketURL'), {
            query: 'token=' + localStorage.getItem('token')
        });


        this.socket.on('connect', () => {

            console.log('Connected to socket server');

        });

        this.socket.on('mapLocation', (data) => {

            this.addMarkerToMap(data);

        });

        setInterval(() => {

            for(let i = this.markers.length - 1; i >= 0; i--) {
                if (this.markers[i].time + 10000 < Date.now()) {

                    this.markers[i].marker.remove();

                    this.markers.splice(i, 1);

                }
            }



        }, 5000);

        this.socket.on('removeLocation', (data) => {

            for(let i in this.markers) {
                if(this.markers[i].id == data) {

                    this.markers[i].marker.remove();

                    this.markers.splice(parseInt[i], 1);

                    break;

                }
            }

        });

    }

    addMap(map: GoogleMap) {

        if(!this.map) {
            this.map = map;
            this.isInitialized = true;
        }

    }

    shareLocation() {

        document.addEventListener('deviceready', () => {

            this.sharingLocation = true;

            this.mapInterval = setInterval(() => {

                if (localStorage.getItem("inEvent") === "true" && localStorage.getItem("shareLocation") === "true") {

                    console.log('sharing location');

                    navigator.geolocation.getCurrentPosition((position) => {

                        this.socket.emit('shareLocation', {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });

                    }, (err) => {

                        console.log(err);

                    }, {timeout: 3000});

                }

            }, 3000);
        }, false);
    }

    beginSharingLocation() {
        this.shareLocation();
    }

    stopSharingLocation() {

        this.socket.emit('stopSharingLocation');

    }

    getInitialization() {
        return this.isInitialized;
    }

    findPersonOnMap(personId) {

        for(let i in this.markers) {

            if(this.markers[i].id == personId) {

                this.markers[i].marker.getPosition((position) => {

                    this.map.setCenter(position);

                });
            }

        }

    }

    getAllMarkers() {

        let idMarkers = [];

        for(let i in this.markers) {
            idMarkers.push(parseInt(this.markers[i].id));
        }

        return idMarkers;

    }

    getAllLocations(callback) {

        this.socket.emit('getAllLocations', (locations) => {

            callback(locations);

        });

    }

    getAllLocationsAndAddToMap() {

        this.socket.on('getAllLocations', (locations) => {

            for(let i in locations) {
                this.addMarkerToMap(locations[i]);
            }

        });

    }

    public addMarkerToMap(data) {

        if(this.map) {

            let hasMatched = false;

            for (let i in this.markers) {
                if (this.markers[i].id == data.id) {

                    hasMatched = true;

                    this.markers[i].marker.setPosition(new LatLng(data.lat, data.lng));

                    this.markers[i].time = Date.now();

                    break;

                }
            }

            if (hasMatched === false) {

                let picture;

                if (data.picture) {

                    picture = 'https://s3.us-east-2.amazonaws.com/airmeet-uploads/pictures/' + data.picture;

                } else {

                    picture = 'https://s3.us-east-2.amazonaws.com/airmeet-uploads/pictures/profile.gif'

                }

                this.map.addMarker({
                    position: new LatLng(data.lat, data.lng),
                    markerClick: (marker: Marker) => {

                        marker.hideInfoWindow();

                        this.events.publish('map:clicked', marker.get('id'));

                    },
                    icon: {
                        url: picture,
                        size: {
                            height: 35,
                            width: 35
                        }
                    }
                }).then((marker: Marker) => {

                    marker.set('id', data.id);

                    this.markers.push({
                        id: data.id,
                        marker: marker,
                        time: Date.now()
                    });

                });

            }

        }

    }

}
