import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ViewTrip } from '../viewTrip/viewTrip';
import { FirebaseGET } from '../../services/firebaseGET.service';

import { FirebaseAuthState } from 'angularfire2';
import { AuthenticationHandler } from "../../services/authenticationHandler.service";

@Component({
	selector: 'page-myTrips',
	templateUrl: 'myTrips.html'
})
export class MyTrips {
	private _trips: Array<any>;

	constructor(public navCtrl: NavController,
				public firebaseGet: FirebaseGET,
				public authenticationHandler: AuthenticationHandler) {
		this._trips = [];

		let currentUser = this.authenticationHandler.getCurrentFirebaseUser();

		//trips.forEach((trip) => {
		//	this._trips.push({
		//		lead: this.firebaseGet.getUserWithID(trip.leadOrganiser),
		//		trip: this.firebaseGet.getTripWithID(trip.$key)
		//	});
		//});
	}

	goToTrip() {
		this.navCtrl.push(ViewTrip)
	}

}
