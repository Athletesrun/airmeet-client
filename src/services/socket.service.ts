import {Injectable} from '@angular/core';
import { Subject } from 'rxjs/Subject';

import * as io from 'socket.io-client';

@Injectable()
export class SocketService {

    private socket: SocketIOClient.Socket;

    private mapInterval;

    private currentLocation;

    private sharingLocation;

    private mapLocationSource = new Subject();
    public mapLocation$ = this.mapLocationSource.asObservable();

    constructor() {

        this.socket = io.connect(localStorage.getItem('socketURL'), {
            query: 'token=' + localStorage.getItem('token')
        });


        this.socket.on('connect', () => {

            console.log('Connected to socket server');



        });

        this.socket.on('mapLocation', (data) => {

            console.log('ben');

            this.mapLocationSource.next(data);

            //this.map.addLocation(data);

        });

        this.socket.on('removeLocation', (data) => {

            //this.map.removeLocation(data.id);

        });

    }

    getAllLocations() {

        this.socket.emit('getAllLocations', (locations) => {

            for(let i in locations) {

                //this.map.addLocation(locations[i]);

            }

        })

    }

    shareLocation() {

        this.sharingLocation = true;

        this.mapInterval = setInterval(() => {

            if (localStorage.getItem("inEvent") === "true" && localStorage.getItem("shareLocation") === "true") {

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
    }

    beginSharingLocation() {
        this.shareLocation();
    }

}
