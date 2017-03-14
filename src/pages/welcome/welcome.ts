import { Component } from '@angular/core';
import { NavController, Content} from 'ionic-angular';

import { HttpService } from '../../services/http.service';

@Component({selector: "welcome", templateUrl: "welcome.html", providers: [HttpService]})

export class Welcome {

    constructor(private api: HttpService) {}

}