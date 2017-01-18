import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ViewTrip } from '../viewTrip/viewTrip';
import { FirebaseGET } from '../../services/firebase.service/get';

import { FirebaseAuthState } from 'angularfire2';
import { AuthenticationHandler } from "../../services/authenticationHandler.service";

@Component({
	selector: 'page-myTrips',
	templateUrl: 'myTrips.html'
})
export class MyTrips {
	private _currentUser: any;
	private _trips: Array<any>;

	constructor(public navCtrl: NavController,
				public firebaseGet: FirebaseGET,
				public authenticationHandler: AuthenticationHandler) {
		this._trips = [];

		this._currentUser = this.authenticationHandler.getCurrentUser();

		let	allTrips = this.firebaseGet.getAllTrips();

		allTrips.forEach((trip) => {
			// determine they are a part of the trip
			if ((trip.leadOrganiser === this._currentUser.key) || (trip.friends.indexOf(this._currentUser.key) > -1)) {
				this.firebaseGet.getUserWithID(trip.leadOrganiser, (leadOrganiser) => {
					this._trips.push({
						lead: leadOrganiser,
						trip: trip
					});
				});
			}
		});
	}

	goToTrip(trip) {
		this.navCtrl.push(ViewTrip, {
			trip: trip
		});
	}

	fetchTrips() {
		let	allTrips = this.firebaseGet.getAllTrips();
		this._trips = [];

		allTrips.forEach((trip) => {
			// determine they are a part of the trip
			if ((trip.leadOrganiser === this._currentUser.key) || (trip.friends.indexOf(this._currentUser.key) > -1)) {
				this.firebaseGet.getUserWithID(trip.leadOrganiser, (leadOrganiser) => {
					this._trips.push({
						lead: leadOrganiser,
						trip: trip
					});
				});
			}
		});
	}

	doRefresh(refresher) {
    console.log('Begin async operation', refresher);
	//this.fetchTrips();

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

}
