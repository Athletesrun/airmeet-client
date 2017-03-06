import {Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class HttpService {

	constructor(private http: Http) {}

	private apiURL = "http://localhost:8080/api/getMessages";

	private token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODcxMjU5MDJ9.EatwzC-4XA0n4v415tQqhPg6XqtnVWPPv4JhV1U_4Gnz2ktDPtT2SxxQ2sAcMakHG5boLwACB4a63ES_0dvI-BfeBwp6PHxR9dFXAo8WEkKuXNyt4HlohlRVxWhw7j7LO5zNyTWi-S40LasI2QgHllW-wRg394h6MKuhJt4XfIOIkxhtI3m9kbzLQvWXYRw56vx-zFUmzyP2w1KUq-sQml_rxqyKobG3Odejtbp5ampABFoF6cTcYwOSnj-ac36cneFL9KSz5opx3BIWfSj8df9VgDKskQztBedWf1zOfYxiUbER8_xNcKQe1eY8hm6eCq5d4AtKBRt4_4d2_FQwZw";

    getMessages() {

        return this.http.post(this.apiURL, JSON.stringify({token: this.token})).toPromise().then((response) => {
        	console.log(response.json());
        }).catch(this.handleError);

    }

    private handleError(error: Response | any) {
    	console.log('error:' + error);
    	return 'REJECTED';
    }

}