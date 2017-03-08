import {Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Message } from '../models/message.model';
import { User } from '../models/user.model';
import { Status } from '../models/status.model';

@Injectable()
export class HttpService {

    //@todo allow for switching between user accounts

	constructor(private http: Http) {}

	private apiURL = localStorage.getItem("apiURL");

	private token = localStorage.getItem("token");

	private userId = JSON.parse(localStorage.getItem("userId")).userId;

    //private token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE4MCwiaWF0IjoxNDg4ODExMDY4fQ.wDj4Qv4WVGnACJZTwBM6YsAERTb0Ic8WruApYX5gWye1v3CBwoVzgVVWAW-qVXqFgAmWqputPpY9kh8vAfWmefECkWIRUEDImLuZmhPv44ruPhHOm7RYfSo76M98mCCGhDM28-WiV2u1sBYayETYbNTxZWhIZjngIKVh7vzNovmLJdLn7D4nsIu13tLzELrBacnWP8NdwqEZPn09RXl-J_7SeKs4ACfxSIhkMVslJxlINEto5m9ri65ib5eFzK7nP6mVFnA0PvLJfLvBzVF-obqpxQYhdUg-HD4bjwwZt3Z9hkvUBYcsuwHqEdCS89KadyDx1TS8oK0gdeWjdu7gnA"

    //other user is "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE4MSwiaWF0IjoxNDg4ODExMTM1fQ.4Fn4vPN3rTCpkhhgrnNQTy92M70IjmoFrSHUw1ilCGqChwbTHq_HGAap6N6ESjbJ1rOAe0Ytu_t5P2LYWynMyqg4b708jG2Ac0WBA3kHsYUVYDMcD5UG-pRHvZZZKwWraejbr3B-5zVpSH49OZ41Rn6LILlw8v4LwUJmOnCtCOzs0FwMCCGG_wCvncaRemWg8rf2gMU3vDUxCcrV3ODbWwz00FOkK1sKAhq9HmkUwHPTth5_s0RUeV1JSnuhDCQSadnA2uUQE77L73EjYw4Eab9Cy1usQKTc1IkEDLJanxeIPFctRsV2DDa41nqujicurVkLw0LSWnriNO7FDSDNTw"

    login(email, password): Observable<Status> { //DONT FORGET TO HASH THE PASSWORD!!!

        return this.http.post(this.apiURL + "accounts/login", {email: email, password: password}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        })

    }

    register(email, password, firstName, lastName): Observable<Status> {

	    return this.http.post(this.apiURL + "accounts/register", {email: email, password: password, firstName: firstName, lastName: lastName}).map((res: Response) => {

	        return res.json();

        }).catch((error: any) => {
	        return Observable.throw(error.json().error || "Server Error");
        });

    }

    getUserProfile(userId): Observable<Status> {

        console.log(this.token);

        return this.http.post(this.apiURL + "getUserProfile", {token: this.token, userId: userId}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });

    }

    getOwnProfile(): Observable<Status> {

        return this.http.post(this.apiURL + "getOwnProfile", {token: this.token}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });

    }

    getAllProfiles(): Observable<Status> {

        return this.http.post(this.apiURL + "getAllProfiles", {token: this.token}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });

    }

    updateProfile(updates): Observable<Status> {

	    updates.token = this.token;

        return this.http.post(this.apiURL + "updateProfile", updates).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });

    }

    joinEvent(eventCode): Observable<Status> {

        return this.http.post(this.apiURL + "joinEvent", {token: this.token, eventCode: eventCode}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });

    }

    leaveEvent(): Observable<Status> {

        return this.http.post(this.apiURL + "leaveEvent", {token: this.token}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });

    }

    getEventInfo(): Observable<Status> {

	    return this.http.post(this.apiURL + "getEventInfo", {token: this.token}).map((res: Response) => {

	        return res.json();

        }).catch((error: any) => {
	        return Observable.throw(error.json().error || "Server Error");
        });

    }

    getMessages(): Observable<Message> {

        return this.http.post(this.apiURL + "getMessages", {token: this.token}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || 'Server error');
        });

    }

    sendMessage(receiver, message): Observable<Status> {

        return this.http.post(this.apiURL + "sendMessage", {token: this.token, message: message, receiver: receiver}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        })

    }

    searchUsers(query): Observable<Status> {

        return this.http.post(this.apiURL + "searchUsers", {token: this.token, query: query}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });

    }

    private handleError(error: Response | any) {
    	console.log('error:' + error);
    	return 'REJECTED';
    }

}