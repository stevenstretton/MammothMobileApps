import { Component } from '@angular/core';

import { ViewController, Platform, NavParams } from 'ionic-angular';

@Component({
	selector: 'page-locationModal',
	templateUrl: 'locationModal.html'
})
export class LocationModal {
	private _tripName: string;
	private _tripMembers: Array<any>;

	private _usersToSeeLocation: Array<any>;

	constructor(public viewCtrl: ViewController,
				public params: NavParams) {
		this._usersToSeeLocation = [];

		this._tripName = params.get('name');
		this._tripMembers = params.get('members');
	}

	dismiss() {
		this.viewCtrl.dismiss(this._usersToSeeLocation);
	}

	ifInArray(userID): boolean {
		return (this._usersToSeeLocation.indexOf(userID) > -1);
	}

	toggleClicked(memberID, check): void {
		if (check) {
			if (!this.ifInArray(memberID)) {
				this._usersToSeeLocation.push(memberID);
			}
		} else {
			if (this.ifInArray(memberID)) {
				this._usersToSeeLocation.splice(this._usersToSeeLocation.indexOf(memberID), 1);
			}
		}
	}
}
