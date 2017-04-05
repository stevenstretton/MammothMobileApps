import { Component } from '@angular/core';

import { NavController, NavParams, ToastController } from 'ionic-angular';
import { ViewTrip } from '../viewTrip/viewTrip';
import { FirebaseGET } from '../../services/firebase/get.service';

import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import _ from "lodash";

@Component({
	selector: 'page-myTrips',
	templateUrl: 'myTrips.html'
})
export class MyTrips {
	private _currentUser: any;
	private _trips: Array<any>;

	constructor(private navCtrl: NavController,
	            private firebaseGet: FirebaseGET,
	            private authenticationHandler: AuthenticationHandler,
	            private toastCtrl: ToastController) {

		this._trips = [];
		this._currentUser = this.authenticationHandler.getCurrentUser();

		console.log("constructor");
		this.firebaseGet.setAllTrips(() => {
			this.sortIfUserInTrip();
		});
	}

	// public ionViewDidEnter(): void {
	//   this.firebaseGet.setAllTrips(() => {
	//	 	 this.sortIfUserInTrip();
	//	 });
	// }

	private sortIfUserInTrip(): void {
		const allTrips = this.firebaseGet.getAllTrips();

		this._trips = [];

		let pushTrip = (trip: any) => {
			this.firebaseGet.getUserWithID(trip.leadOrganiser, (leadOrganiser) => {
				this._trips.push({
					key: trip.key,
					lead: leadOrganiser,
					trip: trip
				});
			});
		};

		if (allTrips) {
			allTrips.forEach((trip) => {

				// determine they are a part of the trip
				if (trip.friends) {
					if ((trip.leadOrganiser === this._currentUser.key) || (trip.friends.indexOf(this._currentUser.key) > -1)) {
						pushTrip(trip);
					}
				} else {
					if (trip.leadOrganiser === this._currentUser.key) {
						pushTrip(trip);
					}
				}
			});
		}
	}

	public refreshTrips(refresher): void {
		this.firebaseGet.setAllTrips(() => {
			this.sortIfUserInTrip();

			// Timeout otherwise refresher is too short
			setTimeout(() => {
				refresher.complete();
			}, 2000);
		});
	}

	private showCreateDeleteTripToast(message): void {
		this.toastCtrl.create({
			message: message,
			duration: 3000,
			position: 'top'
		}).present();
	}

	public goToTrip(trip): void {
		this.navCtrl.push(ViewTrip, {
			trip: trip,
			callback: (_params) => {
				return new Promise((resolve, reject) => {
					if (_params.justDeletedTrip) {
						this.showCreateDeleteTripToast('Trip deleted successfully!');
						this.firebaseGet.setAllTrips(() => {
							this.sortIfUserInTrip();
						});
					}
					if (_params.justDeletedUser) {
						this.showCreateDeleteTripToast('Removed from trip successfully!');
						this.firebaseGet.setAllTrips(() => {
							this.sortIfUserInTrip();
						});
					}
					resolve();
				});
			}
		});
	}
}
