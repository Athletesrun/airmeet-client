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

	private getApiURL() {
        return localStorage.getItem("apiURL");
    }

	private getToken() {
	    return localStorage.getItem("token");
    }

	private getUserId() {
	    return parseInt(localStorage.getItem("userId"));
    }

    login(email, password): Observable<Status> {

        return this.http.post(this.getApiURL() + "accounts/login", {email: email, password: password}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        })

    }

    register(email, password, firstName, lastName): Observable<Status> {

	    return this.http.post(this.getApiURL() + "accounts/register", {email: email, password: password, firstName: firstName, lastName: lastName}).map((res: Response) => {

	        return res.json();

        }).catch((error: any) => {
	        return Observable.throw(error.json().error || "Server Error");
        });

    }

    getUserProfile(userId): Observable<Status> {

        return this.http.post(this.getApiURL() + "getUserProfile", {token: this.getToken(), userId: userId}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });

    }

    getOwnProfile(): Observable<User> {

        return this.http.post(this.getApiURL() + "getOwnProfile", {token: this.getToken()}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });

    }

    getAllProfiles(): Observable<Status> {

        return this.http.post(this.getApiURL() + "getAllProfiles", {token: this.getToken()}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });

    }

    updateProfile(updates): Observable<Status> {

	    updates.token = this.getToken();

        return this.http.post(this.getApiURL() + "updateProfile", updates).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });

    }

    joinEvent(eventCode): Observable<Status> {

        return this.http.post(this.getApiURL() + "joinEvent", {token: this.getToken(), eventCode: eventCode}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });

    }

    leaveEvent(): Observable<Status> {

        return this.http.post(this.getApiURL() + "leaveEvent", {token: this.getToken()}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });

    }

    getEventInfo(): Observable<Event> {

	    return this.http.post(this.getApiURL() + "getEventInfo", {token: this.getToken()}).map((res: Response) => {

	        return res.json();

        }).catch((error: any) => {
	        return Observable.throw(error.json().error || "Server Error");
        });

    }

    getConversation(id): Observable<Message>{

        return this.http.post(this.getApiURL() + "getConversation", {token: this.getToken(), userId: id}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || 'Server error');
        });

    }

    getMessageList(): Observable<Message>{

        return this.http.post(this.getApiURL() + "getMessageList", {token: this.getToken()}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || 'Server error');
        });

    }

    sendMessage(receiver, message): Observable<Status> {

        return this.http.post(this.getApiURL() + "sendMessage", {token: this.getToken(), message: message, receiver: receiver}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        })

    }

    searchUsers(query): Observable<Status> {

        return this.http.post(this.getApiURL() + "searchProfiles", {token: this.getToken(), query: query}).map((res: Response) => {

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
