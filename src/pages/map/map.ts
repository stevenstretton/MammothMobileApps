import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { AuthenticationHandler } from "../../services/authenticationHandler.service";

@Component({
	selector: 'page-map',
	templateUrl: 'map.html'
})
export class Map {
	private _currentUserLat: number;
	private _currentUserLng: number;
	private _tripMembers: Array<any>;
	private _currentUser: any;
	private _membersAllowingToSeeLocation: Array<any> = [];

	constructor(public navCtrl: NavController,
				public navParams: NavParams,
				public authenticationHandler: AuthenticationHandler) {
		this._tripMembers = this.navParams.get('tripMembers');
		this._currentUser = this.authenticationHandler.getCurrentUser();

		this._currentUserLat = this._currentUser.location["lat"];
		this._currentUserLng = this._currentUser.location["lng"];

		this._tripMembers.forEach((tripMember) => {
			// determining they have a location and that the current user is allowed to see it
			if ((tripMember.location) && (tripMember.usersToSeeLocation.indexOf(this._currentUser.key) > -1)) {
				this._membersAllowingToSeeLocation.push(tripMember);
			}
		});
	}
}
