import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseGET } from '../../services/firebaseGET.service';
import { AuthenticationHandler } from '../../services/authenticationHandler.service';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Component({
	selector: 'page-myTrips',
	templateUrl: 'myTrips.html'
})
export class MyTrips {
	trips: FirebaseListObservable<any>;
	email: string;
	password: string;

	constructor(public navCtrl: NavController,
	            private firebaseGet: FirebaseGET,
	            private authenticationHandler: AuthenticationHandler) {}

    loginToFirebase(): void {
		console.log(this.email);
		console.log(this.password);
		this.authenticationHandler.loginFirebase(this.email, this.password);
    }
}
