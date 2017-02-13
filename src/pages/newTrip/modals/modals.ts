import { Component } from '@angular/core';
import { FirebaseGET } from '../../../services/firebase/get.service';
import { ViewController, NavParams } from 'ionic-angular';

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

@Component({
	selector: 'page-presetsModal',
	templateUrl: './templates/presetsModal.html'
})
export class PresetsModal {
	
	private _presetData: Array<any>;
	private _firebasePresets: Array<any>;

	constructor(public viewCtrl: ViewController,
	            public firebaseGet: FirebaseGET,
	            public params: NavParams,) {

					this.fetchAllPresetsFromFirebase()

				}

	findIndexOfPreset(preset): number {
		console.log(this._firebasePresets.indexOf(preset));
		return this._firebasePresets.indexOf(preset)

	}
	submit(preset): void {
		this._presetData = this._firebasePresets[this.findIndexOfPreset(preset)]
		console.log(this._presetData);
		this.viewCtrl.dismiss(this._presetData);
	}

	dismiss(): void {
		this.viewCtrl.dismiss();
	}

	fetchAllPresetsFromFirebase() : void
	{
		this._firebasePresets = []
		this._firebasePresets = this.firebaseGet.getAllPresets();
		console.log(this._firebasePresets);
	}
}
