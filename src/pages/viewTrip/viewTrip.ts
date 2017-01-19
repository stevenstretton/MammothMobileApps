import { Component } from '@angular/core';

import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Map } from '../map/map';
import { FirebaseGET } from "../../services/firebase.service/get";
import { FirebaseDELETE } from "../../services/firebase.service/delete";
import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import {} from "./editModals"

@Component({
	selector: 'page-viewTrip',
	templateUrl: 'viewTrip.html'
})
export class ViewTrip {
	private _trip: any;
	private _tripMembers: Array<any>;
	private _currentUser: any;
	private _callback: Function;

	constructor(public navCtrl: NavController,
				public navParams: NavParams,
				public firebaseGet: FirebaseGET,
				public firebaseDelete: FirebaseDELETE,
				public alertCtrl: AlertController,
				public authenticationHandler: AuthenticationHandler) {
		this._tripMembers = [];
		this._currentUser = this.authenticationHandler.getCurrentUser();

		this._trip = this.navParams.get('trip');
		this._callback = this.navParams.get('callback');

		this._trip.trip.friends.forEach((friendID) => {
			this.firebaseGet.getUserWithID(friendID, (user) => {
				this._tripMembers.push(user);
			});
		});
	}

	showEditModal(index): void {
		// index:
		// ---------------
		// 1 = description
		// 2 = location
		// 3 = start date
		// 4 = start time
		// 5 = end date
		// 6 = transport
		// 7 = friends
		// 8 = items

		switch (index) {
			case 1:

		}
	}

	goToMap() {
		this.navCtrl.push(Map, {
			tripMembers: this._tripMembers
		});
	}

	deleteTrip() {
		this.alertCtrl.create({
			title: 'Delete',
			message: 'Are you sure you want to delete this trip?',
			buttons: [
				{
					text: 'Yes',
					handler: () => {
						this.firebaseDelete.deleteTrip(this._trip.trip.key);
						this._callback({
							justDeletedTrip: true
						}).then(() => {
							this.navCtrl.pop();
						});
					}
				}, {
					text: 'No',
					role: 'cancel'
				}
			]
		}).present();
	}
}
