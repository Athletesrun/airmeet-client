import {Injectable} from '@angular/core';

import * as io from 'socket.io-client';

@Injectable()
export class SocketService {

    private socket: SocketIOClient.Socket;

    private mapInterval;

    private locations = [];

    private currentLocation;

    private sharingLocation;

    constructor() {

        console.log(localStorage.getItem('socketURL'));

        this.socket = io.connect(localStorage.getItem('socketURL'), {
            query: 'token=' + localStorage.getItem('token')
        });


        this.socket.on('connect', () => {

            console.log('Connected to socket server');

        });

        this.socket.on('mapLocation', (data) => {

            console.log('Recieved location');

            let foundInArray = false;

            for(let i in this.locations) {
                if(this.locations[i].id == data.id) {
                    foundInArray = true;
                    this.locations[i] = data;
                }
            }

            if(foundInArray === false) {
                this.locations.push(data);
            }

        });
    }

    getLocations(callback) {

        console.log('getting locations');
        console.log(this.locations);

        callback(this.locations);

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
