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
            console.log('got map location');
            console.log(data);
        });
    }

    getLocations() {

        return this.locations;

    }

    beginSharingLocation() {
        this.mapInterval = setInterval(() => {

            if (localStorage.getItem("inEvent") === "true" && localStorage.getItem("shareLocation") === "true") {

                navigator.geolocation.watchPosition((position) => {

                    this.socket.emit('shareLocation', {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });

                });

            }

        }, 2000);
    }

}
