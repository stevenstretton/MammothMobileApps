import { Component } from '@angular/core';

import { NavController, NavParams, ToastController } from 'ionic-angular';
import { ViewTrip } from '../viewTrip/viewTrip';
import { FirebaseGET } from '../../services/firebase/get.service';

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
	            public authenticationHandler: AuthenticationHandler,
	            public navParams: NavParams,
	            public toastCtrl: ToastController) {
		this._trips = [];
		this._currentUser = this.authenticationHandler.getCurrentUser();

		let justCreatedTrip = this.navParams.get('justCreatedTrip');
		if (justCreatedTrip) {
			this.showCreateDeleteTripToast('Trip created successfully!');
		}

		this.sortIfUserInTrip();
	}

	sortIfUserInTrip(): void {
		console.log("sortIfUserInTrip");
		let allTrips = this.firebaseGet.getAllTrips();

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

	refreshTrips(refresher): void {
		// this.sortIfUserInTrip();
		// refresher.complete()

		this.firebaseGet.setAllTrips(() => {
			this.sortIfUserInTrip();
			refresher.complete();
		});
	}

	showCreateDeleteTripToast(message): void {
		this.toastCtrl.create({
			message: message,
			duration: 3000,
			position: 'top'
		}).present();
	}

	goToTrip(trip) {
		this.navCtrl.push(ViewTrip, {
			trip: trip,
			callback: (_params) => {
				return new Promise((resolve, reject) => {
					if (_params.justDeletedTrip) {
						this.showCreateDeleteTripToast('Trip deleted successfully!');
					}
					resolve()
				});
			}
		});
	}
}
