import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
/*
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
*/

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Message } from '../models/message.model';
import { User } from '../models/user.model';
import { Status } from '../models/status.model';
import { Event } from '../models/event.model';

@Injectable()
export class HttpService {

	constructor(private http: Http, public storage: Storage/*, private transfer: Transfer, private file: File*/) {}

	private getApiURL() {
        return localStorage.getItem("apiURL");
    }

	private getToken() {
	    return localStorage.getItem("token");
    }

    private dataURItoBlob(dataURI) {
      let byteString = atob(dataURI.split(',')[1]);

      let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      let ab = new ArrayBuffer(byteString.length);
      let ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ab], {type: mimeString});

  }

	private getUserId() {
	    return parseInt(localStorage.getItem("userId"));
    }

    login(email, password): Observable<Status> {

        return this.http.post(this.getApiURL() + "/api/accounts/login", {email: email, password: password}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        })

    }

    register(email, password, firstName, lastName): Observable<Status> {

	    return this.http.post(this.getApiURL() + "/api/accounts/register", {email: email, password: password, firstName: firstName, lastName: lastName}).map((res: Response) => {

	        return res.json();

        }).catch((error: any) => {
	        return Observable.throw(error.json().error || "Server Error");
        });

    }

    getUserProfile(userId): Observable<Status> {

        return this.http.post(this.getApiURL() + "/api/getUserProfile", {token: this.getToken(), userId: userId}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });

    }

    getOwnProfile(): Observable<User> {

        return this.http.post(this.getApiURL() + "/api/getOwnProfile", {token: this.getToken()}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });

    }

    getAllProfiles(): Observable<Status> {

        return this.http.post(this.getApiURL() + "/api/getAllProfiles", {token: this.getToken()}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });

    }

    updateProfile(updates): Observable<Status> {

	    updates.token = this.getToken();

        return this.http.post(this.getApiURL() + "/api/updateProfile", updates).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });

    }

    joinEvent(eventCode): Observable<Status> {

        return this.http.post(this.getApiURL() + "/api/joinEvent", {token: this.getToken(), eventCode: eventCode}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });

    }

    leaveEvent(): Observable<Status> {

        return this.http.post(this.getApiURL() + "/api/leaveEvent", {token: this.getToken()}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });

    }

    getEventInfo(): Observable<Event> {

	    return this.http.post(this.getApiURL() + "/api/getEventInfo", {token: this.getToken()}).map((res: Response) => {

	        return res.json();

        }).catch((error: any) => {
	        return Observable.throw(error.json().error || "Server Error");
        });

    }

    getConversation(id): Observable<Message>{

        return this.http.post(this.getApiURL() + "/api/getConversation", {token: this.getToken(), userId: id}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || 'Server error');
        });

    }

    getMessageList(): Observable<Message>{

        return this.http.post(this.getApiURL() + "/api/getMessageList", {token: this.getToken()}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || 'Server error');
        });

    }

    sendMessage(receiver, message): Observable<Status> {

        return this.http.post(this.getApiURL() + "/api/sendMessage", {token: this.getToken(), message: message, receiver: receiver}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        })

    }

    searchUsers(query): Observable<Status> {

        return this.http.post(this.getApiURL() + "/api/searchProfiles", {token: this.getToken(), query: query}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });

    }

    getSavedProfiles(): Observable<User> {
        return this.http.post(this.getApiURL() + "/api/getSavedProfiles", {token: this.getToken()}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });
    }

    getSavedConversations(): Observable<Message> {
        return this.http.post(this.getApiURL() + "/api/getSavedConversations", {token: this.getToken()}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });
    }

    getSavedConversation(userId): Observable<Message> {
        return this.http.post(this.getApiURL() + "/api/getSavedConversation", {token: this.getToken(), userId: userId}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });
    }

    saveProfile(profileId): Observable<Status> {
        return this.http.post(this.getApiURL() + "/api/saveProfile", {token: this.getToken(), profileId: profileId}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });
    }

    saveConversation(userId): Observable<Status> {
        return this.http.post(this.getApiURL() + "/api/saveConversation", {token: this.getToken(), userId: userId}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });
    }
    /*
    updateProfilePicture(file) {
        // let blob = this.dataURItoBlob(file);


      return setInterval(() => { if(results) }, 10)
    }
    */

    unsaveProfile(userId): Observable<Status> {
        return this.http.post(this.getApiURL() + "/api/unsaveProfile", {token: this.getToken(), userId: userId}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });
    }

    unsaveConversation(userId): Observable<Status> {
        return this.http.post(this.getApiURL() + "/api/saveConversation", {token: this.getToken(), userId: userId}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });
    }

    checkIfSavedProfile(userId): Observable<Status> {
        return this.http.post(this.getApiURL() + "/api/checkIfSavedProfile", {token: this.getToken(), userId: userId}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || "Server Error");
        });
    }

    checkIfSavedConversation(userId): Observable<Status> {
        return this.http.post(this.getApiURL() + "/api/checkIfSavedConversation", {token: this.getToken(), userId: userId}).map((res: Response) => {

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
