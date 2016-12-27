import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { Map } from '../map/map';
import { FirebaseGET } from "../../services/firebaseGET.service";

@Component({
	selector: 'page-viewTrip',
	templateUrl: 'viewTrip.html'
})
export class ViewTrip {
	private _trip: any;
	private _tripMembers: Array<any>;

	constructor(public navCtrl: NavController,
				public navParams: NavParams,
				public firebaseGet: FirebaseGET) {
		this._tripMembers = [];

		this._trip = this.navParams.get('trip');

		this._trip.trip.friends.forEach((friendID) => {
			this.firebaseGet.getUserWithID(friendID, (user) => {
				this._tripMembers.push(user);
			});
		});
	}

	goToMap() {
		this.navCtrl.push(Map)
	}
}
