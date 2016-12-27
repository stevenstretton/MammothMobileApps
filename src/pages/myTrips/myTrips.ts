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

		let currentUser = this.authenticationHandler.getCurrentFirebaseUser(),
			allTrips = this.firebaseGet.getAllTrips();

		allTrips.forEach((trip) => {
			// determine they are a part of the trip
			if ((trip.leadOrganiser === currentUser.uid) || (trip.friends.indexOf(currentUser.uid) > -1)) {
				this.firebaseGet.getUserWithID(trip.leadOrganiser, (leadOrganiser) => {
					this._trips.push({
						lead: leadOrganiser,
						trip: trip
					});
				});
			}
		});
	}

	goToTrip() {
		this.navCtrl.push(ViewTrip);
	}

}
