import {Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Message } from '../models/message.model';
import { User } from '../models/user.model';
import { Status } from '../models/status.model';
import { Event } from '../models/event.model';

@Injectable()
export class HttpService {

    //@todo allow for switching between user accounts

	constructor(private http: Http) {}

	private apiURL = localStorage.getItem("apiURL");

	private token = localStorage.getItem("token");

	private userId = parseInt(localStorage.getItem("userId"));

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

        return this.http.post(this.apiURL + "getUserProfile", {token: this.token, userId: userId}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });

    }

    getOwnProfile(): Observable<User> {

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

    getEventInfo(): Observable<Event> {

	    return this.http.post(this.apiURL + "getEventInfo", {token: this.token}).map((res: Response) => {

	        return res.json();

        }).catch((error: any) => {
	        return Observable.throw(error.json().error || "Server Error");
        });

    }

    getConversation(id): Observable<Message>{

        return this.http.post(this.apiURL + "getConversation", {token: this.token, userId: id}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || 'Server error');
        });

    }

    getMessageList(): Observable<Message>{

        return this.http.post(this.apiURL + "getMessageList", {token: this.token}).map((res: Response) => {

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

        return this.http.post(this.apiURL + "searchProfiles", {token: this.token, query: query}).map((res: Response) => {

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
