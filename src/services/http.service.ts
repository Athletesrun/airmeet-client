import {Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Message } from '../models/message.model';

@Injectable()
export class HttpService {

    //@todo implement all api methods here
    //@todo allow for switching between user accounts

	constructor(private http: Http) {}

	private apiURL = "http://localhost:8080/api/";

	private token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2OSwiaWF0IjoxNDg4NzY2NjE1fQ.0JKqdDYYu5QLj4Z3naKR4NckUgosLw4h6L7vTCXI-MrGUYEqVOgXkY-FgyWXFzSawJa9ti8h6YgiWIO01U4TCUV9TOG2ICLI76Y1I9mLVt-_ayEODmhI-XkeAlXQuogLkSKpZpKHApw3pI8LkpCxxCwLfeX5KSdnDWZV87AiAfRKTWiJ_0yOX0IAY3hUKYvELzVpQeF9ljy0izb_7BwnL-NgPEBZnMcz_oljGSFS2O-I4YV-0v6qLwKFe3cJWdsAh3q6RoKqnRPoERXmCUuAJ7UEjUKFc_vcv6dP5BgJymGXDlMe96374qMiwbbM2Efh9jMo-6XQOth8qZ6Nb4eQ5Q";

    getMessages(): Observable<Message> {

        return this.http.post(this.apiURL + "getMessages", {token: this.token}).map((res: Response) => {

            return res.json();

        }).catch((error: any) => {
            return Observable.throw(error.json().error || 'Server error');
        });

    }

    private handleError(error: Response | any) {
    	console.log('error:' + error);
    	return 'REJECTED';
    }

}