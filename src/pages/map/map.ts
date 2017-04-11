import { Component } from '@angular/core';

import { NavController, NavParams, Platform, LoadingController, Events } from 'ionic-angular';

import { SocketService } from '../../services/socket.service';

import {Subscription} from 'rxjs/Subscription';

import { Storage } from '@ionic/storage'

import { Person } from '../people/people';
import { Organization } from '../organizations/organizations';

import { HttpService } from '../../services/http.service';

import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    LatLng,
    Marker
} from '@ionic-native/google-maps';

@Component({
    selector: 'map-page',
    templateUrl: 'map.html',
    providers: [
        GoogleMaps,
        HttpService
    ]
})

export class Map {

    map: GoogleMap;

    private markers = [];
    private userId;

    public locationSubscription: Subscription;
    public removedLocationSubscription: Subscription;

    private userToFind;

    removeLocationInterval;

    constructor(public navCtrl: NavController, public navParams: NavParams, private googleMaps: GoogleMaps, public platform: Platform, public sockets: SocketService, public storage: Storage, private api: HttpService, public loadingCtrl: LoadingController, public events: Events) {
        this.storage.ready().then(() => {
          this.storage.get('userId').then((val) => {
            this.userId = parseInt(val);
          });
        });

        if(navParams.data.userToFind) {

            this.userToFind = navParams.data.userToFind;

        }

        platform.ready().then(() => {

            this.loadMap();
        });

    }

    ngOnInit() {

        this.removeLocationInterval = setInterval(() => {

            for(let i = this.markers.length -1; i >= 0; i--) {
                if(this.markers[i].time + 10000 < Date.now()) {

                    this.markers[i].marker.remove();

                    this.markers.splice(i, 1);

                }
            }

        }, 5000);

    }

    ngOnDestroy() {

        clearInterval(this.removeLocationInterval);

        this.locationSubscription.unsubscribe();
        this.removedLocationSubscription.unsubscribe();

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

        this.map.setVisible(false);

        this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {

            this.map.setVisible(true);

            this.events.subscribe('menu:opened', () => {

                this.map.setClickable(false);

            });

            this.events.subscribe('menu:closed', () => {
                this.map.setClickable(true);
            });

            this.locationSubscription = this.sockets.mapLocation$.subscribe((location) => {

                if(location.id.toString() !== localStorage.getItem('userId')) {
                    let hasMatched = false;

                    for (let i in this.markers) {

                        if (this.markers[i].id === location.id) {

                            hasMatched = true;

                            this.markers[i].marker.setPosition(new LatLng(location.lat, location.lng));
                            this.markers[i].time = Date.now();

                            break;

                        }

                    }

                    if (hasMatched === false) {

                        let picture;

                        if(location.picture) {

                            picture = 'https://s3.us-east-2.amazonaws.com/airmeet-uploads/pictures/' + location.picture;

                        } else {

                            picture = 'https://s3.us-east-2.amazonaws.com/airmeet-uploads/pictures/profile.gif'

                        }

                        this.map.addMarker({
                            position: new LatLng(location.lat, location.lng),
                            markerClick: (marker: Marker) => {

                                marker.hideInfoWindow();

                                this.api.getUserProfile(marker.get('id')).subscribe((user) => {
                                    this.navCtrl.push(Person, {
                                        item: user
                                    });
                                }, (error) => {
                                    console.log(error);
                                });
                                
                            },
                            icon: {
                                url: picture,
                                size: {
                                    height: 35,
                                    width: 35
                                }
                            }
                        }).then((marker: Marker) => {

                            marker.set('id', location.id);

                            this.markers.push({
                                id: location.id,
                                marker: marker,
                                time: Date.now()
                            });

                        });

                    }
                }

            });

            if(this.userToFind) {

                let foundPerson = false;

                let person = this.userToFind;

                for(let i in this.markers) {

                    if(this.markers[i].id === parseInt(person.id)) {

                        let position = this.markers[i].marker.getPosition();

                        console.log(position);

                        foundPerson = true;

                        break;

                    }

                }

                if(!foundPerson) {

                    this.userToFind = null;

                    setTimeout(() => {
                        alert(person.firstName + person.lastName + ' is currently not sharing their location.');
                    }, 500);
                }

            }

            this.api.getAllOrganizations().subscribe((organizations) => {

                for(let i in organizations) {

                    if(organizations[i].lat && organizations[i].lng) {

                        let picture;

                        if(organizations[i].picture) {

                            picture = 'https://s3.us-east-2.amazonaws.com/airmeet-uploads/pictures/' + organizations[i].picture;

                        } else {

                            picture = 'https://s3.us-east-2.amazonaws.com/airmeet-uploads/organizations/organization.png'

                        }

                        const marker = this.map.addMarker({
                            position: new LatLng(organizations[i].lat, organizations[i].lng),
                            markerClick: (marker: Marker) => {

                                marker.hideInfoWindow();

                                this.navCtrl.push(Organization, {
                                    id: parseInt(marker.get('id'))
                                });

                            },
                            icon: {
                                url: picture,
                                size: {
                                    height: 35,
                                    width: 35
                                }
                            }
                        }).then((marker: Marker) => {
                            marker.set('id', organizations[i].id);

                        });

                    }

                }

            }, (error) => {

                console.log(error);

            });

            this.removedLocationSubscription = this.sockets.removedLocation$.subscribe((location) => {

                if(location.id.toString() !== this.userId) {

                    for (let i in this.markers) {

                        if (this.markers[i].id === location.id) {

                            this.markers[i].marker.remove();

                            this.markers.splice(parseInt(i), 1);

                            break;

                        }

                    }

                }

            });

            this.sockets.getAllLocations();

        });

    }

}
