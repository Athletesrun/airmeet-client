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

    }

    getAllLocations() {

        this.socket.emit('getAllLocations', (locations) => {

            for(let i in locations) {

                this.mapLocationSource.next(locations[i]);

            }

        })

    }

    shareLocation() {

        document.addEventListener('deviceready', () => {

            this.sharingLocation = true;

            this.mapInterval = setInterval(() => {

                if (localStorage.getItem("inEvent") === "true" && localStorage.getItem("shareLocation") === "true") {

                    navigator.geolocation.getCurrentPosition((position) => {

                        this.socket.emit('shareLocation', {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });

                    }, (err) => {

                        //console.log(err);

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
