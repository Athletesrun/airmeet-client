import {Injectable} from '@angular/core';

import * as io from 'socket.io-client';

@Injectable()
export class SocketService {

    private socket: SocketIOClient.Socket;

    private mapInterval;

    private locations = [];

    private currentLocation;

    constructor() {

        console.log(localStorage.getItem('socketURL'));

        this.socket = io.connect(localStorage.getItem('socketURL'), {
            query: 'token=' + localStorage.getItem('token')
        });


        this.socket.on('connect', () => {

            console.log('Connected to socket server');

        });

        this.socket.on('mapLocation', (data) => {
            console.log('Received Map Location');
        });
    }

    getLocations() {

        return this.locations;

    }

    shareLocation() {
        this.mapInterval = setInterval(() => {

            if (localStorage.getItem("inEvent") === "true" && localStorage.getItem("shareLocation") === "true") {

                navigator.geolocation.getCurrentPosition((position) => {

                    this.socket.emit('shareLocation', {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });

                    console.log(position);

                }, (err) => {

                    console.log(err);

                }, {timeout: 3000});

            }

        }, 3000);
    }

    beginSharingLocation() {
        this.shareLocation();
        console.log('test async');
    }

}
