import { Component } from '@angular/core';
import { FirebaseGET } from '../../../services/firebase/get.service';
import { ViewController, Platform, NavParams } from 'ionic-angular';

@Component({
	selector: 'page-friendsModal',
	templateUrl: './templates/friendsModal.html'
})
export class FriendsModal {
	private _friendsAdded: Array<any>;
	private _selectedFriends: Array<any>;

	constructor(public viewCtrl: ViewController,
	            public firebaseGet: FirebaseGET,
	            public params: NavParams,) {
		this._friendsAdded = [];
		this._selectedFriends = [];

		this._selectedFriends = params.get('selectedFriends');

		this._selectedFriends.forEach((friend) => {
			if (friend.isAdded) {
				this._friendsAdded.push(friend.user.key);
			}
		});
	}

	submit() {
		this.viewCtrl.dismiss();
	}

	ifInArray(friendID): boolean {
		return (this._friendsAdded.indexOf(friendID) > -1);
	}

	toggleClicked(friendID, check): void {
		if (check) {
			if (!this.ifInArray(friendID)) {
				this._friendsAdded.push(friendID);
			}
		} else {
			if (this.ifInArray(friendID)) {
				this._friendsAdded.splice(this._friendsAdded.indexOf(friendID), 1);
			}
		}
	}

}
