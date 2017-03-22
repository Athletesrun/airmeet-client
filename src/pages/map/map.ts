import { Component, ViewChild } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'map-page',
    templateUrl: 'map.html'
})

export class Map {

    private context:CanvasRenderingContext2D;
    private canvas;

    constructor(public navCtrl: NavController, public navParams: NavParams) {

    }

    ngOnInit() {

        this.canvas = <HTMLCanvasElement>document.getElementById('mapCanvas');

        this.context = this.canvas.getContext("2d");

        let context = this.context;


        let floorPlan = new Image();

        floorPlan.src = "/assets/floorPlan.png";

        floorPlan.onload = function() {

            context.drawImage(floorPlan, 50, 50);

        }

    }

}
