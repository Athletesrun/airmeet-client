import {Injectable} from '@angular/core';
import { Subject } from 'rxjs/Subject';

import * as io from 'socket.io-client';

import { Location } from '../models/location.model';

@Injectable()
export class SocketService {

    private socket: SocketIOClient.Socket;

    private mapInterval;

    private sharingLocation;

    private mapLocationSource = new Subject<Location>();
    public mapLocation$ = this.mapLocationSource.asObservable();

    private removedLocationSource = new Subject<Location>();
    public removedLocation$ = this.removedLocationSource.asObservable();

    private markers = [];

    private markersToRemove = [];

    private removeMarkersInterval;

    constructor() {

        this.socket = io.connect(localStorage.getItem('socketURL'), {
            query: 'token=' + localStorage.getItem('token')
        });


        this.socket.on('connect', () => {

            console.log('Connected to socket server');

        });

        this.socket.on('mapLocation', (data) => {

            this.mapLocationSource.next(data);

        });

        this.socket.on('removeLocation', (data) => {

            this.removedLocationSource.next(data);

        });

        this.removeMarkersInterval = setInterval(() => {
          for (let i = this.markers.length - 1; i >= 0; i--) {
            if (this.markers[i].time + 10000 < Date.now()) {
              this.markers[i].marker.remove();
              this.markers.splice(i, 1);
            }
          }
        }, 3000);
    }

    getMarkers() {

        return this.markers;

    }

    getMarkersToRemove() {

      return this.markersToRemove;

    }

    setMarker(marker) {
      let found = false;
      for(let i in this.markers) {
        if(this.markers[i].id == marker.id) {
          found = true;
          this.markers[i] = marker;
          break;
        }
      }

      if(found === false) {
        this.markers.push(marker);
      }
    }



    getAllLocations(callback) {

        this.socket.on('sharingAllLocations', (locations => {

            for(let i in locations) {

                this.mapLocationSource.next(locations[i]);

            }

            setTimeout(() => {
                callback();
            }, 1000);

        }));

        this.socket.emit('getAllLocations');

    }

    getAllLocationsReturn(callback) {

        this.socket.on('sharingAllLocations', (locations => {

            callback(locations);

        }));

        this.socket.emit('getAllLocations');

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

}
