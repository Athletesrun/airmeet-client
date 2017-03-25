import { Component, ViewChild } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import * as io from 'socket.io-client';

import * as PinchZoomCanvas from 'pinch-zoom-canvas';
import * as Impetus from 'impetus';

@Component({
    selector: 'map-page',
    templateUrl: 'map.html'
})

export class Map {

    private context:CanvasRenderingContext2D;
    private canvas;

    socket: SocketIOClient.Socket;

    constructor(public navCtrl: NavController, public navParams: NavParams) {

    }

    ngOnInit() {

        this.socket = io.connect('localhost:8080', {
            query: 'token=' + localStorage.getItem('token')
        });

        this.socket.on('connect', () => {
            console.log('connected YAY!!');
        });



        this.canvas = <HTMLCanvasElement>document.getElementById('mapCanvas');

        this.context = this.canvas.getContext("2d");

        let context = this.context;
        let canvas = this.canvas;


        /*context.moveTo(0, 0);

        context.lineTo(1000, 1000);
        context.stroke();

        let floorPlan = new Image();

        floorPlan.src = "https://s3.us-east-2.amazonaws.com/airmeet-uploads/floorPlan.png";

        floorPlan.onload = function() {

            context.drawImage(floorPlan, 50, 50);

        }*/

        let pinchZoom = new PinchZoomCanvas({
            canvas: canvas,
            path: "https://s3.us-east-2.amazonaws.com/airmeet-uploads/floorPlan.png",
            momentum: true,
            zoomMax: 10,
            doubletap: true,
            onZoomEnd: (zoom, zoomed) => {
                context.moveTo(0, 0);

                context.lineTo(1000, 1000);
                context.stroke();
            },
            onZoom: (zoom) => {

            }
        });


    }

}
