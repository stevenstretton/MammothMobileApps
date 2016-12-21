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

	constructor(public platform: Platform,
	            public viewCtrl: ViewController,
				public params: NavParams) {
		this._tripName = params.get('name');
		this._tripMembers = params.get('members');
	}

	dismiss() {
		this.viewCtrl.dismiss();
	}

	checkIfInArray(userID): boolean {
		return (this._usersToSeeLocation.indexOf(userID) > -1);
	}

	toggleClicked(member, check): void {
		console.log(member);
		console.log(check);
	}
}
